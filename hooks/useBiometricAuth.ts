"use client";

// ─── Helpers ──────────────────────────────────────────────────

function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = "";
  for (const byte of bytes) str += String.fromCharCode(byte);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function base64urlToBuffer(base64url: string): ArrayBuffer {
  const padded = base64url + "===".slice((base64url.length + 3) % 4);
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  const str = atob(base64);
  const buf = new ArrayBuffer(str.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < str.length; i++) view[i] = str.charCodeAt(i);
  return buf;
}

function randomChallenge(): ArrayBuffer {
  const buf = new Uint8Array(32);
  crypto.getRandomValues(buf);
  return buf.buffer as ArrayBuffer;
}

function rpId(): string {
  // Works on localhost and real domains
  return window.location.hostname;
}

// ─── Types ────────────────────────────────────────────────────

export interface BiometricRegistrationResult {
  credentialId: string;
  publicKeyBase64: string;
  deviceName: string;
}

// ─── Hook ─────────────────────────────────────────────────────

export function useBiometricAuth() {
  const isSupported =
    typeof window !== "undefined" &&
    "credentials" in navigator &&
    typeof (window as Window & { PublicKeyCredential?: unknown }).PublicKeyCredential !== "undefined";

  /**
   * Register a new WebAuthn credential (first-time setup).
   * Triggers Face ID / Touch ID / fingerprint on the device.
   */
  async function register(
    userId: string,
    userEmail: string
  ): Promise<BiometricRegistrationResult | null> {
    if (!isSupported) return null;

    const challenge = randomChallenge();

    let credential: PublicKeyCredential;
    try {
      credential = (await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { id: rpId(), name: "Logasiko" },
          user: {
            id: new TextEncoder().encode(userId),
            name: userEmail,
            displayName: userEmail,
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" },   // ES256
            { alg: -257, type: "public-key" }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            residentKey: "discouraged",
          },
          timeout: 60_000,
          attestation: "none",
        },
      })) as PublicKeyCredential;
    } catch {
      return null;
    }

    const response = credential.response as AuthenticatorAttestationResponse;
    const pubKey = typeof response.getPublicKey === "function" ? response.getPublicKey() : null;

    return {
      credentialId: bufferToBase64url(credential.rawId),
      publicKeyBase64: pubKey ? bufferToBase64url(pubKey) : "",
      deviceName: detectDeviceName(),
    };
  }

  /**
   * Authenticate using an existing credential.
   * Returns true if the biometric was verified by the device.
   */
  async function authenticate(credentialId: string): Promise<boolean> {
    if (!isSupported) return false;

    const challenge = randomChallenge();
    try {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          rpId: rpId(),
          allowCredentials: [
            {
              id: base64urlToBuffer(credentialId),
              type: "public-key",
              transports: ["internal"],
            },
          ],
          userVerification: "required",
          timeout: 60_000,
        },
      });
      return credential !== null;
    } catch {
      return false;
    }
  }

  return { isSupported, register, authenticate };
}

function detectDeviceName(): string {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua)) return "iPhone";
  if (/iPad/.test(ua)) return "iPad";
  if (/Android/.test(ua)) return "Android";
  if (/Mac/.test(ua)) return "Mac";
  if (/Windows/.test(ua)) return "Windows PC";
  return "Device";
}
