import { Translations } from "./en"

const ja: Translations = {
  common: {
    ok: "OK",
    cancel: "キャンセル",
    back: "戻る",
    delete: "削除",
  },
  homeScreen: {
    title: "マイコレクション",
    headerTitle: "🏠 マイコレクション",
    subtitle: "捕まえた瞬間",
    deleteAlertTitle: "出会いを削除",
    deleteAlertMessage: "本当にこの{{petType}}との出会いを削除しますか？この操作は取り消せません。",
    emptyState: {
      title: "まだ出会いがありません",
      description: "カメラをタップして、ペットコレクションの旅を始めましょう！",
      suggestionTitle: "💡 撮影のヒント：",
      suggestion1: "• 近所の猫や犬",
      suggestion2: "• 公園のペット",
      suggestion3: "• 見かけた野生動物",
    },
  },
  welcomeScreen: {
    postscript:
      "注目！ — このアプリはお好みの見た目では無いかもしれません(デザイナーがこのスクリーンを送ってこない限りは。もしそうなら公開しちゃいましょう！)",
    readyForLaunch: "このアプリはもう少しで公開できます！",
    exciting: "(楽しみですね！)",
  },
  errorScreen: {
    title: "問題が発生しました",
    friendlySubtitle:
      "本番では、エラーが投げられた時にこのページが表示されます。もし使うならこのメッセージに変更を加えてください(`app/i18n/jp.ts`)レイアウトはこちらで変更できます(`app/screens/ErrorScreen`)。もしこのスクリーンを取り除きたい場合は、`app/app.tsx`にある<ErrorBoundary>コンポーネントをチェックしてください",
    reset: "リセット",
  },
  emptyStateComponent: {
    generic: {
      heading: "静かだ...悲しい。",
      content:
        "データが見つかりません。ボタンを押してアプリをリロード、またはリフレッシュしてください。",
      button: "もう一度やってみよう",
    },
  },
}

export default ja
