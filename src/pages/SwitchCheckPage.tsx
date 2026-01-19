import { Box } from "@mui/material";
import RadioSet from "./switchcheckpages/RadioSet";
import DisplayByRadio from "./switchcheckpages/DisplayByRadio";

/**
 * プッシュ型実装の試行とその困難さについて
 * 
 * 本実装では、ラジオボタンの値を表示するコンポーネントとして「プル型」と「プッシュ型」の
 * 2つのアプローチを検討しました。プル型（DisplayByRadio）は実装できましたが、
 * プッシュ型の実装は困難であり、最終的に断念しました。
 * 
 * 【プッシュ型の設計思想】
 * プッシュ型は「ラジオボタン側（RadioSetPush）が能動的に値を通知する」という設計思想です。
 * DisplayByRadioPushは値を受け取るだけであり、DOMを直接参照したり、値を取得しに行ったり
 * しないという前提でした。
 * 
 * 【試行した実装方法】
 * 
 * 1. カスタムDOMイベント方式（最初の試行）
 *    - RadioSetPushがラジオボタンの変更時にCustomEventを発火
 *    - DisplayByRadioPushがdocument.addEventListenerでイベントをリッスン
 *    - 問題点：画面リフレッシュ時に、RadioSetPushが初期値のイベントを発火するタイミングと
 *      DisplayByRadioPushがイベントリスナーを登録するタイミングが競合し、イベントを見逃す
 * 
 * 2. タイミング制御による解決の試み
 *    - RadioSetPushの初期値イベント発火をsetTimeoutで遅延
 *    - DisplayByRadioPushでも初期値をDOMから取得するフォールバックを追加
 *    - 問題点：タイミングによる制御は常に危険であり、確実性が保証できない
 * 
 * 3. リクエスト/レスポンス方式（2回目の試行）
 *    - DisplayByRadioPushがマウント時に「現在の値を教えて」とリクエストイベントを発火
 *    - RadioSetPushがリクエストを受け取り、現在の状態を返すイベントを発火
 *    - 問題点：結局「DisplayByRadioPushがRadioSetPushに値を聞きに行く」というプル型の
 *      焼き直しになってしまい、プッシュ型の設計思想を満たさない
 * 
 * 【根本的な問題】
 * プッシュ型の「ラジオボタン側が能動的に通知する」という思想を維持しつつ、
 * 初期値の問題を解決する方法が見つかりませんでした。
 * - タイミング制御：危険で確実性がない
 * - リクエスト/レスポンス：プル型の焼き直し
 * - 状態管理の共有（Context等）：新規ファイル作成が禁止されていたため実装困難
 * 
 * そのため、現在はプル型（DisplayByRadio）のみを実装しています。
 * プル型は、DisplayByRadioがDOMから直接値を取得する方式であり、
 * タイミング問題を回避でき、確実に初期値も取得できます。
 */
const SwitchCheckPage = () => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4, p: 2 }}>
            <h5>switch page test</h5>

            <Box>
                <h6>【プル型】DisplayByRadioがDOMから値を取得</h6>
                <RadioSet radioGroupName="radio-set" defaultValue="1" />
                <DisplayByRadio radioGroupName="radio-set" switchContentId="1">
                    <div>ここはラジオボタンの値が1のときに表示されます</div>
                </DisplayByRadio>
                <DisplayByRadio radioGroupName="radio-set" switchContentId="2">
                    <div>ここはラジオボタンの値が2のときに表示されます</div>
                </DisplayByRadio>
                <DisplayByRadio radioGroupName="radio-set" switchContentId="3">
                    <div>ここはラジオボタンの値が3のときに表示されます</div>
                </DisplayByRadio>
                <DisplayByRadio radioGroupName="radio-set" switchContentId="unknown">
                    <div>ここはラジオボタンの値が不明のときに表示されます</div>
                </DisplayByRadio>
            </Box>
        </Box>
    );
};

export default SwitchCheckPage;