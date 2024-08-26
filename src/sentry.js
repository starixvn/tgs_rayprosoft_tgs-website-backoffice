import { useEffect } from "react"
import * as Sentry from "@sentry/react"
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType
} from "react-router-dom"

Sentry.init({
  dsn: "https://e15be3b91235b812367bf68469317e69@sentry-s1.nexentgame.com/8",
  integrations: [
    // See docs for support of different versions of variation of react router
    // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes
    })
    // Sentry.replayIntegration()
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  tracesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
  tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
})
