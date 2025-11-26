import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
  component: IndexComponent,
  loader: async () => {
    throw redirect({
      to: "/login",
    });
  },
});

function IndexComponent() {
  return <h1>Index</h1>;
}
