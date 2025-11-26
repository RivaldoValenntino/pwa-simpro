/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { NotFoundComponent } from "./components/not-found";
import { decrypt, encrypt } from "./utils/encrypt";

export const router = createRouter({
  defaultNotFoundComponent: () => NotFoundComponent(),
  routeTree,
  stringifySearch: (searchObj) => {
    if (!searchObj || Object.keys(searchObj).length === 0) return "";
    return `?q=${encrypt(searchObj)}`;
  },

  parseSearch: (searchStr) => {
    const params = new URLSearchParams(searchStr);
    const q = params.get("q");
    return q ? decrypt(q) : {};
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  context: { queryClient: undefined!, auth: undefined! },
});

// --- PATCH GLOBAL navigate ---
const originalNavigate = router.navigate.bind(router);

router.navigate = (async (opts: any) => {
  if (typeof document === "undefined" || !("startViewTransition" in document)) {
    return originalNavigate(opts);
  }

  return new Promise<void>((resolve) => {
    (document as any).startViewTransition(async () => {
      await originalNavigate(opts);
      resolve();
    });
  });
}) as typeof router.navigate;
// --- END PATCH ---

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}