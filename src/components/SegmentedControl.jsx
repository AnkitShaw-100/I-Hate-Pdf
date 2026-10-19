import { useId, useRef } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const SegmentedControl = ({ options, value, onChange, label, size = "md" }) => {
  const groupId = useId();
  const refs = useRef([]);

  const handleKeyDown = (e, i) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  const sizing =
    size === "sm"
      ? "h-8 px-3.5 text-[13px]"
      : "h-9 px-4 text-[14px] sm:h-10 sm:px-5 sm:text-[15px]";

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex max-w-full rounded-full bg-fill p-0.75"
    >
      {options.map((option, i) => {
        const selected = option.value === value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium transition-colors ${sizing} ${
              selected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {selected && (
              <motion.span
                layoutId={`segment-${groupId}`}
                className="absolute inset-0 rounded-full bg-surface-raised shadow-[0_1px_2px_rgb(0_0_0/0.08),0_2px_8px_rgb(0_0_0/0.06)] dark:bg-[#636366]"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative inline-flex items-center gap-1.5">
              {Icon && (
                <Icon
                  className={`size-4 transition-opacity ${selected ? "" : "opacity-70"}`}
                  style={option.color ? { color: option.color } : undefined}
                  strokeWidth={2}
                />
              )}
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
