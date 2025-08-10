// src/routes/quizzes/quizzes.$id.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quizzes/$id")({
  component: QuizTakingPage,
});

function QuizTakingPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Quiz</h2>
      <p className="text-muted-foreground">Quiz runner coming soon.</p>
    </div>
  );
}
