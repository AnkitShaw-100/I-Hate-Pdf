import { Loader2 } from "lucide-react";

const PrimaryButton = ({
  children,
  loading = false,
  loadingLabel,
  disabled,
  onClick,
  variant = "filled",
  type = "button",
}) => {
  const styles =
    variant === "filled"
      ? "bg-primary text-primary-foreground hover:brightness-110 active:brightness-95"
      : "bg-fill text-primary hover:bg-hairline/70";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`inline-flex h-12 min-w-44 items-center justify-center gap-2 rounded-full px-7 text-[17px] font-medium transition-[filter,background-color,opacity] disabled:cursor-not-allowed disabled:opacity-40 ${styles}`}
    >
      {loading && <Loader2 className="size-4.5 animate-spin" />}
      {loading ? loadingLabel : children}
    </button>
  );
};

export default PrimaryButton;
