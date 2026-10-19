import { ChevronLeft, ChevronRight, X } from "lucide-react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const formatSize = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

// On devices with hover, controls appear on hover/focus; on touch they're always visible.
const revealOnHover =
  "opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 group-focus-within:opacity-100";

const ControlButton = ({ label, onClick, disabled, children, tone = "default" }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    disabled={disabled}
    className={`grid size-7 place-items-center rounded-full backdrop-blur-md transition disabled:opacity-0 ${
      tone === "danger"
        ? "bg-black/55 text-white hover:bg-destructive"
        : "bg-black/55 text-white hover:bg-black/75"
    }`}
  >
    {children}
  </button>
);

const ImagePreview = ({
  file,
  url,
  index,
  total,
  onRemove,
  onMove,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
}) => {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: isDragging ? 0.4 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      className="group relative list-none"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.(index);
      }}
      onDragOver={(e) => onDragOver?.(e, index)}
      onDragEnd={() => onDragEnd?.()}
    >
      <div className="relative aspect-square cursor-grab overflow-hidden rounded-2xl bg-fill active:cursor-grabbing">
        <img
          src={url}
          alt={file.name}
          draggable={false}
          className="h-full w-full object-cover"
        />

        <div className={`absolute inset-x-2 top-2 flex justify-between transition-opacity ${revealOnHover}`}>
          <div className="flex gap-1">
            <ControlButton
              label={`Move ${file.name} earlier`}
              onClick={() => onMove(index, index - 1)}
              disabled={index === 0}
            >
              <ChevronLeft className="size-4" strokeWidth={2.25} />
            </ControlButton>
            <ControlButton
              label={`Move ${file.name} later`}
              onClick={() => onMove(index, index + 1)}
              disabled={index === total - 1}
            >
              <ChevronRight className="size-4" strokeWidth={2.25} />
            </ControlButton>
          </div>

          <ControlButton label={`Remove ${file.name}`} onClick={() => onRemove(index)} tone="danger">
            <X className="size-4" strokeWidth={2.25} />
          </ControlButton>
        </div>
      </div>

      <div className="mt-2 px-0.5">
        <p className="text-[13px] font-medium text-foreground">Page {index + 1}</p>
        <p className="truncate text-[12px] text-muted-foreground" title={file.name}>
          {file.name} · {formatSize(file.size)}
        </p>
      </div>
    </motion.li>
  );
};

export default ImagePreview;
