import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="display text-[80px] font-semibold text-foreground">404</p>

        <p className="mt-3 text-xl text-muted-foreground">
          There’s no page at this address.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-primary px-6 text-[17px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Go to PDF tools
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
