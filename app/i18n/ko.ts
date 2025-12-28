import { Translations } from "./en"

const ko: Translations = {
  common: {
    ok: "확인!",
    cancel: "취소",
    back: "뒤로",
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
      "잠깐! — 지금 보시는 것은 아마도 당신의 앱의 모양새가 아닐겁니다. (디자이너분이 이렇게 건내주셨다면 모를까요. 만약에 그렇다면, 이대로 가져갑시다!) ",
    readyForLaunch: "출시 준비가 거의 끝난 나만의 앱!",
    exciting: "(오, 이거 신나는데요!)",
  },
  errorScreen: {
    title: "뭔가 잘못되었습니다!",
    friendlySubtitle:
      "이 화면은 오류가 발생할 때 프로덕션에서 사용자에게 표시됩니다. 이 메시지를 커스터마이징 할 수 있고(해당 파일은 `app/i18n/ko.ts` 에 있습니다) 레이아웃도 마찬가지로 수정할 수 있습니다(`app/screens/error`). 만약 이 오류화면을 완전히 없에버리고 싶다면 `app/app.tsx` 파일에서 <ErrorBoundary> 컴포넌트를 확인하기 바랍니다.",
    reset: "초기화",
  },
  emptyStateComponent: {
    generic: {
      heading: "너무 텅 비어서.. 너무 슬퍼요..",
      content: "데이터가 없습니다. 버튼을 눌러서 리프레쉬 하시거나 앱을 리로드하세요.",
      button: "다시 시도해봅시다",
    },
  },
}

export default ko
