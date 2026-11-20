export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="11" fill="#e5642a" />
      <rect x="0" y="0" width="40" height="20" rx="11" fill="#f08a24" />
      <rect x="0" y="12" width="40" height="8" fill="#f08a24" />
      <path
        d="M9 13 L13.5 28 L20 17 L26.5 28 L31 13"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
