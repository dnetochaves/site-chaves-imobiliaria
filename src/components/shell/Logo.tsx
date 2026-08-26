import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-lg font-semibold text-text-primary"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M23 9 A11 11 0 1 0 23 23"
          stroke="var(--color-petroleo-700)"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />
        <rect
          x="19"
          y="14"
          width="11"
          height="4"
          rx="1"
          fill="var(--color-brand-secondary)"
        />
      </svg>
      chaves
    </Link>
  );
}
