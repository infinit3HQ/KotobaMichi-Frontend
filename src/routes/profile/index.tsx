// src/routes/profile/profile.tsx
import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/organisms/protected-route";

export const Route = createFileRoute("/profile/")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <ProtectedRoute>
      <div>
        <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
        <p className="text-muted-foreground">
          User info and attempts coming soon.
        </p>
      </div>
    </ProtectedRoute>
  );
}
