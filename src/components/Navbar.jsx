import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => (
  <header className="nav-glass sticky top-0 z-50 border-b border-hairline/60">
    <nav
      aria-label="Main"
      className="mx-auto flex h-16 max-w-245 items-center justify-between px-4 sm:px-6"
    >
      <Logo />
      <ThemeToggle />
    </nav>
  </header>
);

export default Navbar;
