"use client";

import { useEffect, useRef, useState } from "react";

const words = [
  "Productively",
  "Competently",
  "Expediently",
  "Resourcefully",
  "Systematically",
];

export function HeroTypewriter() {
  const [text, setText] = useState(words[0]!);
  const wordIdx = useRef(0);

  useEffect(() => {
    let charIdx = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const typeNext = () => {
      const target = words[wordIdx.current]!;
      if (charIdx < target.length) {
        setText(target.slice(0, charIdx + 1));
        charIdx++;
        timeoutId = setTimeout(typeNext, 50);
      }
    };

    const rotate = () => {
      charIdx = 0;
      wordIdx.current = (wordIdx.current + 1) % words.length;
      typeNext();
    };

    typeNext();
    const interval = setInterval(rotate, 5000);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, []);

  return (
    <span
      suppressHydrationWarning
      className="text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
    >
      {text}.
    </span>
  );
}
