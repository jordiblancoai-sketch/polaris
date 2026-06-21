"use client";

export function Logo({
  size = "md",
  dark = false,
}: {
  size?: "sm" | "md" | "lg";
  dark?: boolean;
}) {
  const iconSize = size === "sm" ? 24 : size === "lg" ? 48 : 32;
  const textClass =
    size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";
  const textColor = dark ? "text-navy-100" : "text-navy-900";

  return (
    <span className={`inline-flex items-center gap-2 select-none`}>
      {/* Icon: navy circle with golden crosshair/target */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle cx="16" cy="16" r="16" fill="#0f1e45" />
        {/* Outer ring */}
        <circle cx="16" cy="16" r="9" stroke="#e8b414" strokeWidth="1.5" fill="none" />
        {/* Inner dot */}
        <circle cx="16" cy="16" r="2.5" fill="#e8b414" />
        {/* Cross hairs */}
        <line x1="16" y1="4" x2="16" y2="10" stroke="#e8b414" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="16" y1="22" x2="16" y2="28" stroke="#e8b414" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4" y1="16" x2="10" y2="16" stroke="#e8b414" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="22" y1="16" x2="28" y2="16" stroke="#e8b414" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* Wordmark */}
      <span className={`font-bold tracking-tight leading-none ${textClass}`}>
        <span className={textColor}>Polar</span><span style={{ color: "#e8b414" }}>is</span>
      </span>
    </span>
  );
}

export default Logo;
