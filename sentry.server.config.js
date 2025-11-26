import * as Sentry from "@sentry/astro";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import config from "./src/config/config.json";
Sentry.init({
  dsn: config.sentry.dsn,
  // Adds request headers and IP for users, for more info visit: for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/astro/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  integrations: [
    // Add our Profiling integration
    nodeProfilingIntegration(),
  ],
  // Enable logs to be sent to Sentry
  enableLogs: true,
  // Define how likely traces are sampled. Adjust this value in production,
  // or use tracesSampler for greater control.
  tracesSampleRate: config.sentry.traces_sample_rate,
  // Set sampling rate for profiling
  // This is relative to tracesSampleRate
  profilesSampleRate: config.sentry.profiles_sample_rate,
  environment: config.site.environment
});