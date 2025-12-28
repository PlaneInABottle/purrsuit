import { Translations } from "./en"

const fr: Translations = {
  common: {
    ok: "OK !",
    cancel: "Annuler",
    back: "Retour",
    delete: "Supprimer",
  },
  homeScreen: {
    title: "Ma Collection",
    headerTitle: "🏠 Ma Collection",
    subtitle: "Vos moments capturés",
    deleteAlertTitle: "Supprimer la rencontre",
    deleteAlertMessage:
      "Êtes-vous sûr de vouloir supprimer cette rencontre avec {{petType}} ? Cette action est irréversible.",
    emptyState: {
      title: "Aucune rencontre pour le moment",
      description: "Appuyez sur la caméra pour commencer votre collection d'animaux !",
      suggestionTitle: "💡 Essayez de capturer :",
      suggestion1: "• Le chat ou le chien du voisin",
      suggestion2: "• Les animaux au parc",
      suggestion3: "• La faune que vous croisez",
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
