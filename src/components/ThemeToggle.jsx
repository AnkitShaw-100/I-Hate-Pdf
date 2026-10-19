import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="grid size-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-fill hover:text-foreground"
      aria-label={isDark ? "Switch to light appearance" : "Switch to dark appearance"}
    >
      {isDark ? (
        <Sun className="size-4.5" strokeWidth={1.75} />
      ) : (
        <Moon className="size-4.5" strokeWidth={1.75} />
      )}
    </button>
  );
};

export default ThemeToggle;
