import { hc } from "hono/client";
import { AppType } from "worker/app";

const client = hc<AppType>("/api", {
  init: {
    credentials: "include",
  },
});

export const apiClient = client as typeof client & { api: any };
