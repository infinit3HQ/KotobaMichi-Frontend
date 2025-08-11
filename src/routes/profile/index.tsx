// src/routes/profile/profile.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/organisms/protected-route";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { UserProfile, UserAttemptsResponse } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Skeleton } from "@/components/atoms/skeleton";

export const Route = createFileRoute("/profile/")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <ProfileCard />
        <AttemptsCard />
      </div>
    </ProtectedRoute>
  );
}

function ProfileCard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", "me"],
    queryFn: async () => (await api.get<UserProfile>("/users/me")).data,
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-14 w-full" />
        ) : isError || !data ? (
          <p className="text-destructive">Failed to load profile.</p>
        ) : (
          <div className="space-y-1">
            <p><span className="text-muted-foreground">Email:</span> {data.email}</p>
            <p><span className="text-muted-foreground">Role:</span> {data.role}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AttemptsCard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", "me", "attempts", { page: 1, limit: 10 }],
    queryFn: async () => (await api.get<UserAttemptsResponse>("/users/me/attempts", { params: { page: 1, limit: 10 } })).data,
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Attempts</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-destructive">Failed to load attempts.</p>
        ) : data && data.attempts.length > 0 ? (
          <ul className="space-y-2">
            {data.attempts.map((a) => (
              <li key={a.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Score: {a.score}</div>
                  <div className="text-xs text-muted-foreground">{new Date(a.completedAt).toLocaleString()}</div>
                </div>
                <Link to="/results/$attemptId" params={{ attemptId: a.id }} className="underline text-sm">View</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No attempts yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
