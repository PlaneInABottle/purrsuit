import { Translations } from "./en"

const es: Translations = {
  common: {
    ok: "OK",
    cancel: "Cancelar",
    back: "Volver",
    delete: "Delete",
  },
  homeScreen: {
    title: "My Collection",
    headerTitle: "🏠 My Collection",
    subtitle: "Your captured moments",
    deleteAlertTitle: "Delete Encounter",
    deleteAlertMessage:
      "Are you sure you want to delete this {{petType}} encounter? This cannot be undone.",
    emptyState: {
      title: "No encounters yet",
      description: "Tap the camera to start your pet collection journey!",
      suggestionTitle: "💡 Try capturing:",
      suggestion1: "• Your neighbor's cat or dog",
      suggestion2: "• Pets at the park",
      suggestion3: "• Wildlife you encounter",
    },
  },
  welcomeScreen: {
    postscript:
      "psst — Esto probablemente no es cómo se va a ver tu app. (A menos que tu diseñador te haya enviado estas pantallas, y en ese caso, ¡lánzalas en producción!)",
    readyForLaunch: "Tu app, casi lista para su lanzamiento",
    exciting: "(¡ohh, esto es emocionante!)",
  },
  errorScreen: {
    title: "¡Algo salió mal!",
    friendlySubtitle:
      "Esta es la pantalla que verán tus usuarios en producción cuando haya un error. Vas a querer personalizar este mensaje (que está ubicado en `app/i18n/es.ts`) y probablemente también su diseño (`app/screens/ErrorScreen`). Si quieres eliminarlo completamente, revisa `app/app.tsx` y el componente <ErrorBoundary>.",
    reset: "REINICIA LA APP",
  },
  emptyStateComponent: {
    generic: {
      heading: "Muy vacío... muy triste",
      content:
        "No se han encontrado datos por el momento. Intenta darle clic en el botón para refrescar o recargar la app.",
      button: "Intentemos de nuevo",
    },
  },
}

export default es
