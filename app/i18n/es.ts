import { Translations } from "./en"

const es: Translations = {
  common: {
    ok: "OK",
    cancel: "Cancelar",
    back: "Volver",
    delete: "Eliminar",
  },
  homeScreen: {
    title: "Mi Colección",
    headerTitle: "🏠 Mi Colección",
    subtitle: "Tus momentos capturados",
    deleteAlertTitle: "Eliminar Encuentro",
    deleteAlertMessage:
      "¿Estás seguro de que quieres eliminar este encuentro con {{petType}}? Esto no se puede deshacer.",
    emptyState: {
      title: "No hay encuentros aún",
      description: "¡Toca la cámara para comenzar tu viaje de colección de mascotas!",
      suggestionTitle: "💡 Intenta capturar:",
      suggestion1: "• El gato o perro de tu vecino",
      suggestion2: "• Mascotas en el parque",
      suggestion3: "• Vida silvestre que encuentres",
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
