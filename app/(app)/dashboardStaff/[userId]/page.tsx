"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "@/lib/toast";
import { XModal } from "@/components/XModal";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

type LeaveType = "annual" | "sick" | "other";

const LEAVE_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  annual: { bg: "#b0f0d6", color: "#0b513d" },
  sick: { bg: "#ffdbd0", color: "#832600" },
  other: { bg: "#ebefec", color: "#404944" },
  pending: { bg: "#ffdbd0", color: "#832600" },
  approved: { bg: "#b0f0d6", color: "#0b513d" },
  rejected: { bg: "#ffdad6", color: "#93000a" },
};

export default function StaffDashboardPage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const userId = params.userId as Id<"users">;

  const me = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");
  const todayEntry = useQuery(api.attendance.getTodayEntry, isAuthenticated && userId ? { staffUserId: userId } : "skip");
  const history = useQuery(api.attendance.getStaffAttendance, isAuthenticated && userId ? { staffUserId: userId } : "skip");
  const myLeave = useQuery(api.leave.listMyLeaveRequests, isAuthenticated ? {} : "skip");

  const clockIn = useMutation(api.attendance.clockIn);
  const clockOut = useMutation(api.attendance.clockOut);
  const requestLeave = useMutation(api.leave.requestLeave);

  const [loading, setLoading] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: "annual" as LeaveType, startDate: "", endDate: "", reason: "" });

  useEffect(() => {
    if (me === undefined) return;
    if (me === null) { router.replace("/login"); return; }
    // admins can view staff dashboards, otherwise redirect away if not the right user
    if (me._id !== userId && me.platformRole !== "superAdmin" && me.role !== "admin") {
      router.replace(`/dashboardStaff/${me._id}`);
    }
  }, [me, userId, router]);

  const handleClockIn = async () => {
    setLoading(true);
    try {
      await clockIn({});
      toast("Clocked in successfully!", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to clock in", "error");
    } finally { setLoading(false); }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      await clockOut();
      toast("Clocked out successfully!", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to clock out", "error");
    } finally { setLoading(false); }
  };

  const handleLeaveRequest = async () => {
    if (!leaveForm.startDate || !leaveForm.endDate) { toast("Please fill in all required fields", "error"); return; }
    setLoading(true);
    try {
      await requestLeave({ type: leaveForm.type, startDate: leaveForm.startDate, endDate: leaveForm.endDate, reason: leaveForm.reason || undefined });
      toast("Leave request submitted!", "success");
      setShowLeaveModal(false);
      setLeaveForm({ type: "annual", startDate: "", endDate: "", reason: "" });
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to submit leave request", "error");
    } finally { setLoading(false); }
  };

  const isOwnDashboard = me?._id === userId;
  const isClockedIn = !!todayEntry && !todayEntry.clockOutTime;
  const isClockedOut = !!todayEntry?.clockOutTime;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const recentHistory = (history ?? []).slice(0, 5);

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  if (me === undefined || todayEntry === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f6faf7" }}>
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[48px] animate-spin" style={{ color: "#003527" }}>progress_activity</span>
          <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "12px", color: "#707974" }}>Loading your workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: "#f6faf7" }}>
      {/* Top header */}
      <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: "#f6faf7", borderColor: "rgba(191,201,195,0.4)", boxShadow: "0 1px 12px rgba(6,78,59,0.04)" }}>
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          <div>
            <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
              Welcome back, {me?.firstName}
            </p>
            <h1 className="font-bold text-lg leading-none mt-0.5" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>{dateStr}</h1>
          </div>
          <span
            className="text-xs px-3 py-1.5 rounded-lg font-mono font-bold"
            style={{ backgroundColor: "#064e3b", color: "#b0f0d6" }}
          >
            {timeStr}
          </span>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        {/* Shift status banner */}
        {todayEntry && (
          <div
            className="flex items-center gap-3 rounded-xl p-4 border"
            style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)", boxShadow: "0 2px 10px rgba(6,78,59,0.04)" }}
          >
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: isClockedOut ? "#003527" : "#ac3400" }} />
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: "#003527" }}>
                {isClockedOut ? "Shift Complete" : "Currently Clocked In"}
              </p>
              <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
                In: {formatTime(todayEntry.entryTime)}
                {todayEntry.clockOutTime ? ` · Out: ${formatTime(todayEntry.clockOutTime)}` : ""}
                {todayEntry.hoursWorked ? ` · ${todayEntry.hoursWorked}h` : ""}
              </p>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-mono"
              style={todayEntry.late ? { backgroundColor: "#ffdbd0", color: "#832600" } : { backgroundColor: "#b0f0d6", color: "#0b513d" }}
            >
              {todayEntry.late ? "Late" : "On Time"}
            </span>
          </div>
        )}

        {/* Central clock-in / clock-out button */}
        {isOwnDashboard && (
          <section className="flex flex-col items-center py-8 relative">
            <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-20">
              <div className="w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: "#b0f0d6" }} />
            </div>
            <button
              onClick={isClockedIn ? handleClockOut : handleClockIn}
              disabled={loading || isClockedOut}
              className="relative w-44 h-44 rounded-full flex flex-col items-center justify-center gap-2 transition-all duration-300 active:scale-95 overflow-hidden border-4 disabled:opacity-60"
              style={{
                backgroundColor: isClockedOut ? "#ebefec" : isClockedIn ? "#064e3b" : "#003527",
                borderColor: isClockedOut ? "rgba(191,201,195,0.3)" : "rgba(176,240,214,0.2)",
                boxShadow: isClockedOut ? "none" : "0 20px 40px -10px rgba(0,53,39,0.4)",
                color: isClockedOut ? "#707974" : "#ffffff",
              }}
            >
              <span
                className="material-symbols-outlined text-5xl transition-transform"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isClockedOut ? "task_alt" : isClockedIn ? "logout" : "fingerprint"}
              </span>
              <span className="font-bold text-base" style={{ fontFamily: "var(--font-hanken, sans-serif)" }}>
                {isClockedOut ? "Done" : isClockedIn ? "Clock Out" : "Sign In"}
              </span>
            </button>
            <p className="mt-5 text-sm italic" style={{ color: "#707974" }}>
              {isClockedOut ? "See you tomorrow!" : isClockedIn ? "Tap to end your shift" : "Tap to authenticate identity"}
            </p>
          </section>
        )}

        {/* Quick actions */}
        {isOwnDashboard && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowLeaveModal(true)}
              className="flex flex-col items-start p-5 rounded-xl border transition-all text-left"
              style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)", boxShadow: "0 2px 8px rgba(6,78,59,0.04)" }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "#b0f0d6" }}>
                <span className="material-symbols-outlined text-[20px]" style={{ color: "#003527" }}>event_busy</span>
              </div>
              <p className="font-bold text-sm" style={{ color: "#003527" }}>Request Leave</p>
              <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>Annual / Medical</p>
            </button>
            <button
              onClick={() => {}}
              className="flex flex-col items-start p-5 rounded-xl border transition-all text-left"
              style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)", boxShadow: "0 2px 8px rgba(6,78,59,0.04)" }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "#ffdbd0" }}>
                <span className="material-symbols-outlined text-[20px]" style={{ color: "#ac3400" }}>history</span>
              </div>
              <p className="font-bold text-sm" style={{ color: "#003527" }}>View History</p>
              <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>Past 30 Days</p>
            </button>
          </div>
        )}

        {/* Recent activity */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>Recent Activity</h3>
          </div>
          <div
            className="rounded-xl border overflow-hidden"
            style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}
          >
            {recentHistory.length === 0 ? (
              <div className="py-10 flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-[32px]" style={{ color: "#bfc9c3" }}>history</span>
                <p className="text-sm" style={{ color: "#707974" }}>No activity yet</p>
              </div>
            ) : (
              recentHistory.map((entry, i) => (
                <div
                  key={entry._id as string}
                  className="flex items-center justify-between p-4"
                  style={{ borderBottom: i < recentHistory.length - 1 ? "1px solid rgba(191,201,195,0.2)" : "none" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: entry.late ? "#ffdbd0" : "#b0f0d6" }}
                    >
                      <span className="material-symbols-outlined text-[18px]" style={{ color: entry.late ? "#832600" : "#003527" }}>login</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#181d1b" }}>
                        {new Date(entry.entryTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                      <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
                        {formatTime(entry.entryTime)}
                        {entry.clockOutTime ? ` → ${formatTime(entry.clockOutTime)}` : " (no checkout)"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-mono"
                      style={entry.late ? { backgroundColor: "#ffdbd0", color: "#832600" } : { backgroundColor: "#b0f0d6", color: "#0b513d" }}
                    >
                      {entry.late ? "Late" : "On Time"}
                    </span>
                    {entry.hoursWorked != null && (
                      <span className="text-xs font-mono" style={{ color: "#707974" }}>{entry.hoursWorked}h</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Leave requests */}
        {myLeave && myLeave.length > 0 && (
          <section className="space-y-3">
            <h3 className="font-bold" style={{ color: "#003527", fontFamily: "var(--font-hanken, sans-serif)" }}>My Leave Requests</h3>
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "#ffffff", borderColor: "rgba(191,201,195,0.3)" }}>
              {myLeave.map((req, i) => {
                const style = LEAVE_TYPE_COLORS[req.status] ?? LEAVE_TYPE_COLORS.pending;
                return (
                  <div
                    key={req._id}
                    className="flex items-center justify-between p-4"
                    style={{ borderBottom: i < myLeave.length - 1 ? "1px solid rgba(191,201,195,0.2)" : "none" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: LEAVE_TYPE_COLORS[req.type]?.bg ?? "#ebefec" }}>
                        <span className="material-symbols-outlined text-[18px]" style={{ color: LEAVE_TYPE_COLORS[req.type]?.color ?? "#404944" }}>event_busy</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold capitalize" style={{ color: "#181d1b" }}>{req.type} Leave</p>
                        <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>
                          {req.startDate} → {req.endDate}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-mono capitalize" style={{ backgroundColor: style.bg, color: style.color }}>
                      {req.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Leave Request Modal */}
      <XModal
        open={showLeaveModal}
        onClose={() => { setShowLeaveModal(false); setLeaveForm({ type: "annual", startDate: "", endDate: "", reason: "" }); }}
        title="Request Leave"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button color="gray" variant="soft" onClick={() => setShowLeaveModal(false)}>Cancel</Button>
            <Button loading={loading} onClick={handleLeaveRequest}>Submit Request</Button>
          </div>
        }
      >
        <div className="space-y-5 p-1">
          <div>
            <p className="text-xs uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>Leave Type</p>
            <div className="grid grid-cols-3 gap-2">
              {(["annual", "sick", "other"] as LeaveType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setLeaveForm((f) => ({ ...f, type: t }))}
                  className="py-2 rounded-lg text-sm font-medium capitalize transition-all"
                  style={leaveForm.type === t
                    ? { backgroundColor: "#003527", color: "#ffffff" }
                    : { backgroundColor: "#f6faf7", color: "#404944", border: "1px solid rgba(191,201,195,0.5)" }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>Start Date</p>
              <input
                type="date"
                value={leaveForm.startDate}
                onChange={(e) => setLeaveForm((f) => ({ ...f, startDate: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={{ borderColor: "rgba(191,201,195,0.5)", backgroundColor: "#f6faf7", color: "#181d1b", fontFamily: "var(--font-jetbrains, monospace)" }}
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-jetbrains, monospace)", color: "#707974" }}>End Date</p>
              <input
                type="date"
                value={leaveForm.endDate}
                onChange={(e) => setLeaveForm((f) => ({ ...f, endDate: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={{ borderColor: "rgba(191,201,195,0.5)", backgroundColor: "#f6faf7", color: "#181d1b", fontFamily: "var(--font-jetbrains, monospace)" }}
              />
            </div>
          </div>
          <FormField label="Reason (optional)" name="reason">
            <textarea
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm((f) => ({ ...f, reason: e.target.value }))}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
              style={{ borderColor: "rgba(191,201,195,0.5)", backgroundColor: "#f6faf7", color: "#181d1b" }}
              placeholder="e.g. Annual family vacation…"
            />
          </FormField>
        </div>
      </XModal>
    </div>
  );
}
