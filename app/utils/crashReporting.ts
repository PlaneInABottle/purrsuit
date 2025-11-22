import * as Sentry from "@sentry/react-native"

export const routingInstrumentation = Sentry.reactNavigationIntegration()

/**
 * Initialize Sentry for error tracking
 */
export const initCrashReporting = () => {
  const sentryDSN = process.env.SENTRY_DSN
  if (sentryDSN) {
    Sentry.init({
      dsn: sentryDSN,
      enableAutoSessionTracking: true,
      // Only capture errors, disable performance monitoring
      tracesSampleRate: 0,
      // Offline caching - store up to 30 events locally before sending
      maxCacheItems: 30,
      // Only enable in production
      enabled: !__DEV__,
      // Integrations
      integrations: [Sentry.reactNativeTracingIntegration(), routingInstrumentation],
    })
  }
}

/**
 * Error classifications used to sort errors on error reporting services.
 */
export enum ErrorType {
  /**
   * An error that would normally cause a red screen in dev
   * and force the user to sign out and restart.
   */
  FATAL = "Fatal",
  /**
   * An error caught by try/catch where defined using Reactotron.tron.error.
   */
  HANDLED = "Handled",
}

/**
 * Manually report a handled error.
 */
export const reportCrash = (error: Error, type: ErrorType = ErrorType.FATAL) => {
  if (__DEV__) {
    // Log to console and Reactotron in development
    const message = error.message || "Unknown"
    console.error(error)
    console.log(message, type)
  } else {
    Sentry.captureException(error, {
      tags: {
        type,
      },
    })
  }
}

export const sentryWrap = (Component: any) =>
  process.env.SENTRY_DSN ? Sentry.wrap(Component) : Component
