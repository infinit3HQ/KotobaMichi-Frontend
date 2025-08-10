// src/components/organisms/navbar.tsx
import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/atoms/button";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function Navbar() {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="font-bold text-lg">
          KotobaMichi
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">Home</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/quizzes">Quizzes</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/words">Words</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/profile">Profile</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          {token && user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.email}
              </span>
              <Button
                size="sm"
                className="ml-2"
                variant="destructive"
                onClick={() => {
                  logout();
                  toast.success("Logged out");
                  router.navigate({ to: "/" });
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="ml-2">
              <Link to="/auth/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
