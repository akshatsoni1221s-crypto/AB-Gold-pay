export function AbMonogram({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
    >
      <text
        x="14"
        y="20"
        textAnchor="middle"
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="700"
        fontSize="18"
      >
        AB
      </text>
    </svg>
  );
}
