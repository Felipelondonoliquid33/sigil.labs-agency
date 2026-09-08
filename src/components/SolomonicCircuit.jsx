"use client";

export default function SolomonicCircuit({
  className = "",
  size = 32,
  color = "currentColor",
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Solomonic Circuit"
      role="img"
      style={{ color }}
    >
      <circle cx="250" cy="250" r="210" stroke="currentColor" strokeWidth="12" />
      <line x1="250" y1="60" x2="250" y2="440" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
      <circle cx="250" cy="60" r="10" fill="currentColor" />
      <circle cx="250" cy="440" r="10" fill="currentColor" />
      <path d="M 170,165 C 170,115 250,115 250,165 C 250,115 330,115 330,165" stroke="currentColor" strokeWidth="12" strokeLinecap="round" fill="none" />
      <circle cx="170" cy="165" r="14" fill="currentColor" />
      <circle cx="330" cy="165" r="14" fill="currentColor" />
      <line x1="115" y1="250" x2="200" y2="250" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
      <line x1="300" y1="250" x2="385" y2="250" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
      <circle cx="110" cy="250" r="15" fill="currentColor" />
      <circle cx="390" cy="250" r="15" fill="currentColor" />
      <path d="M 180,345 C 210,385 250,385 250,345 C 250,385 290,385 320,345" stroke="currentColor" strokeWidth="12" strokeLinecap="round" fill="none" />
      <circle cx="180" cy="345" r="12" fill="currentColor" />
      <circle cx="320" cy="345" r="12" fill="currentColor" />
      <circle cx="250" cy="250" r="50" stroke="currentColor" strokeWidth="12" />
      <circle cx="250" cy="250" r="18" fill="currentColor" />
    </svg>
  );
}
