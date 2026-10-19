import { useCallback, useId, useRef, useState } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const sheetSpring = { type: "spring", stiffness: 380, damping: 26 };

// Three stacked sheets that fan out while files hover over the zone.
const PageStack = ({ active }) => {
  const sheets = [
    { rest: { rotate: -4, x: -6, y: 2 }, fan: { rotate: -16, x: -30, y: 6 } },
    { rest: { rotate: 3, x: 6, y: 1 }, fan: { rotate: 14, x: 30, y: 6 } },
    { rest: { rotate: 0, x: 0, y: 0 }, fan: { rotate: 0, x: 0, y: -10 } },
  ];

  return (
    <div className="relative h-24 w-20" aria-hidden="true">
      {sheets.map((sheet, i) => (
        <motion.div
          key={i}
          className={`absolute inset-0 rounded-[10px] border border-hairline shadow-[0_1px_3px_rgb(0_0_0/0.08)] ${
            i === 0
              ? "bg-[color-mix(in_srgb,var(--tool,var(--primary))_22%,var(--page-paper))]"
              : i === 1
                ? "bg-[color-mix(in_srgb,var(--tool,var(--primary))_12%,var(--page-paper))]"
                : "bg-(--page-paper)"
          }`}
          initial={false}
          animate={active ? sheet.fan : sheet.rest}
          transition={sheetSpring}
        >
          {i === 2 && (
            <div className="flex h-full flex-col gap-1.5 px-3 pt-4">
              <span className="h-1.5 w-8 rounded-full bg-(--tool,var(--primary))" />
              <span className="h-1 w-full rounded-full bg-(--page-line)" />
              <span className="h-1 w-full rounded-full bg-(--page-line)" />
              <span className="h-1 w-3/4 rounded-full bg-(--page-line)" />
              <span className="h-1 w-full rounded-full bg-(--page-line)" />
              <span className="h-1 w-1/2 rounded-full bg-(--page-line)" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

const DropZone = ({
  accept,
  multiple = false,
  isAccepted,
  onFilesAdded,
  onRejected,
  title,
  activeTitle,
  hint,
  compact = false,
}) => {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);
  // Counts nested dragenter/dragleave pairs so hovering child elements doesn't flicker.
  const dragDepth = useRef(0);

  const takeFiles = useCallback(
    (list) => {
      const all = Array.from(list || []);
      const picked = multiple ? all : all.slice(0, 1);
      const accepted = picked.filter(isAccepted);
      const rejected = picked.length - accepted.length;

      if (rejected > 0) onRejected?.(rejected);
      if (accepted.length) onFilesAdded(accepted);
    },
    [isAccepted, multiple, onFilesAdded, onRejected]
  );

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragDepth.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    takeFiles(e.dataTransfer.files);
  };

  const handleInput = (e) => {
    takeFiles(e.target.files);
    e.target.value = "";
  };

  if (compact) {
    return (
      <label
        htmlFor={inputId}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed text-[13px] font-medium transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring ${
          isDragging
            ? "border-(--tool,var(--primary)) bg-[color-mix(in_srgb,var(--tool,var(--primary))_8%,transparent)] text-(--tool,var(--primary))"
            : "border-hairline text-muted-foreground hover:border-(--tool,var(--primary)) hover:text-(--tool,var(--primary)) dark:border-[#48484a]"
        }`}
      >
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={handleInput}
        />
        <span className="grid size-9 place-items-center rounded-full bg-fill">
          <Plus className="size-4.5" strokeWidth={2} />
        </span>
        Add more
      </label>
    );
  }

  return (
    <label
      htmlFor={inputId}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`relative flex min-h-80 w-full cursor-pointer flex-col items-center justify-center gap-7 rounded-3xl border-[1.5px] border-dashed px-6 py-12 text-center transition-colors duration-200 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring ${
        isDragging
          ? "border-(--tool,var(--primary)) bg-[color-mix(in_srgb,var(--tool,var(--primary))_7%,transparent)]"
          : "border-hairline hover:border-[color-mix(in_srgb,var(--tool,var(--primary))_45%,transparent)] hover:bg-[color-mix(in_srgb,var(--tool,var(--primary))_4%,transparent)] dark:border-[#48484a]"
      }`}
    >
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={handleInput}
      />

      <PageStack active={isDragging} />

      <div>
        <p className="display text-[24px] font-semibold text-foreground sm:text-[28px]">
          {isDragging ? activeTitle : title}
        </p>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Drop {multiple ? "files" : "a file"} here, or{" "}
          <span className="font-medium text-primary">choose from your device</span>
        </p>
        {hint && <p className="mt-4 text-[13px] text-muted-foreground/80">{hint}</p>}
      </div>
    </label>
  );
};

export default DropZone;
