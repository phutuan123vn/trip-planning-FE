import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © 2026 MyApp. All rights reserved.
        </p>

        <nav className="flex items-center gap-4 text-sm">
          <Link to="." className="text-muted-foreground hover:text-foreground">
            Privacy
          </Link>

          <Link to="." className="text-muted-foreground hover:text-foreground">
            Terms
          </Link>

          <Link to="." className="text-muted-foreground hover:text-foreground">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
