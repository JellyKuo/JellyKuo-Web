import handler from "@astrojs/cloudflare/entrypoints/server";
import * as Sentry from "@sentry/cloudflare";
import config from "./src/config/config.json";

export default Sentry.withSentry(
  (env) => ({
    dsn: env.SENTRY_DSN || config.sentry.dsn,
    enableLogs: true,
    environment: env.SENTRY_ENVIRONMENT || config.site.environment,
    sendDefaultPii: true,
    tracesSampleRate: Number(
      env.SENTRY_TRACES_SAMPLE_RATE ?? config.sentry.traces_sample_rate,
    ),
  }),
  handler,
);
