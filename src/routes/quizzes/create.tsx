// src/routes/quizzes/quizzes.create.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quizzes/create")({
  component: QuizCreationPage,
});

function QuizCreationPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Create a Custom Quiz</h2>
      <p className="text-muted-foreground">Builder UI coming soon.</p>
    </div>
  );
}
