import { Translations } from "./en"

const fr: Translations = {
  common: {
    ok: "OK !",
    cancel: "Annuler",
    back: "Retour",
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
      "psst  — Ce n'est probablement pas à quoi ressemble votre application. (À moins que votre designer ne vous ait donné ces écrans, dans ce cas, mettez la en prod !)",
    readyForLaunch: "Votre application, presque prête pour le lancement !",
    exciting: "(ohh, c'est excitant !)",
  },
  errorScreen: {
    title: "Quelque chose s'est mal passé !",
    friendlySubtitle:
      "C'est l'écran que vos utilisateurs verront en production lorsqu'une erreur sera lancée. Vous voudrez personnaliser ce message (situé dans `app/i18n/fr.ts`) et probablement aussi la mise en page (`app/screens/ErrorScreen`). Si vous voulez le supprimer complètement, vérifiez `app/app.tsx` pour le composant <ErrorBoundary>.",
    reset: "RÉINITIALISER L'APPLICATION",
  },
  emptyStateComponent: {
    generic: {
      heading: "Si vide... si triste",
      content:
        "Aucune donnée trouvée pour le moment. Essayez de cliquer sur le bouton pour rafraîchir ou recharger l'application.",
      button: "Essayons à nouveau",
    },
  },
}

export default fr
