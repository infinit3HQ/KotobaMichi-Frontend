// src/routes/quizzes/quizzes.index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/quizzes/")({
  component: QuizListPage,
});

function QuizListPage() {
  return (
    <div className="space-y-2">
      <p className="text-muted-foreground">Lists coming soon.</p>
      <ul className="list-disc pl-6">
        <li>
          <Link to="/quizzes/$id" params={{ id: "1" }} className="underline">
            Example Quiz #1
          </Link>
        </li>
      </ul>
    </div>
  );
}
