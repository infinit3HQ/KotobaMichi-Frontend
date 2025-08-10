// src/routes/results/results.$attemptId.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/results/$attemptId")({
  component: QuizResultsPage,
});

function QuizResultsPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Results</h2>
      <p className="text-muted-foreground">Results UI coming soon.</p>
    </div>
  );
}
