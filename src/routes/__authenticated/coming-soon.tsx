import { createFileRoute } from "@tanstack/react-router";
import ComingSoon from "../../components/coming-soon";

export const Route = createFileRoute("/__authenticated/coming-soon")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ComingSoon />;
}
