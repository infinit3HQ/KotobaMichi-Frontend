// src/routes/results/results.$attemptId.tsx
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";

export const Route = createFileRoute("/results/$attemptId")({
  component: QuizResultsPage,
});

function QuizResultsPage() {
  const { attemptId } = useParams({ from: "/results/$attemptId" })
  // Backend docs don't expose GET /results/:attemptId, so we'll show a simple receipt
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Submitted</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Your attempt ID:</p>
        <p className="font-mono text-sm">{attemptId}</p>
        <p className="text-sm mt-2 text-muted-foreground">
          Detailed results fetching endpoint isn't documented yet. Once available, this page can display per-question breakdown.
        </p>
      </CardContent>
    </Card>
  );
}
