import { useId } from "react";

const PAGE = "M16 4h23l13 13v39a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Z";

// A red page torn in two: the name, and the split tool, in one shape.
export const LogoMark = ({ className = "size-8" }) => {
  const id = useId();
  const left = `${id}-l`;
  const right = `${id}-r`;

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <clipPath id={left}>
          <path d="M0 0h31l4 14-6 11 7 11-6 11 4 17H0Z" />
        </clipPath>
        <clipPath id={right}>
          <path d="M31 0h33v64H34l-4-17 6-11-7-11 6-11Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${left})`} transform="rotate(-5 14 60) translate(-1.5 0)">
        <path d={PAGE} fill="#e5352b" />
      </g>
      <g clipPath={`url(#${right})`} transform="rotate(5 50 60) translate(1.5 0)">
        <path d={PAGE} fill="#e5352b" />
        <path d="M39 4v9a4 4 0 0 0 4 4h9Z" fill="#f59c95" />
      </g>
    </svg>
  );
};

const Logo = () => (
  <a href="/" className="flex items-center gap-2 rounded-md" aria-label="I Hate PDF home">
    <LogoMark className="size-9" />
    <span className="text-[19px] font-bold tracking-[-0.03em]">I Hate PDF</span>
  </a>
);

export default Logo;
