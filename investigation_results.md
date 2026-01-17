# BasicVSpinner高さ問題の調査結果

## 調査日時
2026-01-16

## 現状確認

### コンポーネント構造
```
Box (height: "40px" or "60px")
  └─ NumberField.Root (高さ指定なし)
      └─ NumberField.Input
          └─ OutlinedInput (height: "100%")
              └─ input要素 (height: "100%")
```

### 視覚的確認結果
- スクリーンショット確認: 2つの入力フィールド（40px/60px指定）が視覚的に同じ高さに見える
- これは高さが正しく反映されていない問題を示している

## 調査項目

### 1. Box要素の確認
- [ ] 期待値: height: 40px / 60px
- [ ] 実際の値: [調査中]
- [ ] display: [調査中]
- [ ] position: absolute

### 2. NumberField.Root要素の確認
- [ ] 期待値: height: 40px / 60px (親から継承)
- [ ] 実際の値: [調査中]
- [ ] display: [調査中]

### 3. OutlinedInput要素の確認
- [ ] 期待値: height: 100% (親の高さを参照)
- [ ] 実際の値: [調査中]
- [ ] 親要素の高さ参照: [調査中]

### 4. input要素の確認
- [ ] 期待値: height: 100% (親の高さを参照)
- [ ] 実際の値: [調査中]

## 調査結果

### NumberField.Rootのデフォルト動作（Base UI公式ドキュメントより）
- **レンダリング**: `<div>`要素としてレンダリングされる
- **display**: `block`（ブラウザデフォルト）
- **height**: `auto`（Base UIはスタイルを提供しない）

### 問題の根本原因
1. ✅ **NumberField.Rootが高さを継承していない**
   - `NumberField.Root`に`height`の指定がないため、デフォルトで`height: auto`になっている
   - `OutlinedInput`の`height: "100%"`が親要素（`NumberField.Root`）の高さを参照しようとするが、親が`auto`のため正しく計算できない

2. ✅ **高さの伝播が途切れている**
   - `Box` → `NumberField.Root` → `OutlinedInput` → `input`のチェーンで、`NumberField.Root`が高さを伝播していない

## 対応方針

### 修正方法
`NumberField.Root`に`height: "100%"`を設定して、親の`Box`の高さを正しく継承させる。

### 修正箇所
`BasicVSpinner.tsx`の`NumberField.Root`にスタイルを追加する必要がある。

### 修正コード案

#### 方法1: styleプロパティを使用（推奨）
```tsx
<NumberField.Root
  {...getIdAttribute(objectname)}
  data-caption={caption}
  defaultValue={initialvalue}
  min={min}
  max={max}
  step={step}
  required={!!compulsory}
  disabled={!enable}
  readOnly={!editable}
  style={{ height: "100%" }}  // 追加
>
```

#### 方法2: classNameとsxを使用（MUIのスタイリングシステムと統一）
```tsx
<Box sx={combinedSx}>
  <Box sx={{ height: "100%" }}>
    <NumberField.Root
      {...getIdAttribute(objectname)}
      data-caption={caption}
      defaultValue={initialvalue}
      min={min}
      max={max}
      step={step}
      required={!!compulsory}
      disabled={!enable}
      readOnly={!editable}
    >
```

**推奨**: 方法1（`style`プロパティ）がシンプルで効果的

## 修正実装

### 実施した修正
`BasicVSpinner.tsx`の`NumberField.Root`に`style={{ height: "100%" }}`を追加しました。

```tsx
<NumberField.Root
  {...getIdAttribute(objectname)}
  data-caption={caption}
  defaultValue={initialvalue}
  min={min}
  max={max}
  step={step}
  required={!!compulsory}
  disabled={!enable}
  readOnly={!editable}
  style={{ height: "100%" }}  // 追加済み
>
```

## 検証手順

### ブラウザ開発者ツールでの確認方法

1. **ページを開く**
   - `http://localhost:5173` を開く
   - 開発者ツール（F12）を開く

2. **Box要素の確認**
   - Elementsタブで`Box`要素（`position: absolute`）を選択
   - Computedタブで以下を確認：
     - `height`: 40px または 60px になっているか
     - `display`: どの値か
   - Stylesタブで`combinedSx`のスタイルが適用されているか確認

3. **NumberField.Root要素の確認**
   - `Box`の子要素である`NumberField.Root`（`<div>`要素）を選択
   - Computedタブで以下を確認：
     - `height`: `100%`が計算されて親の高さ（40px/60px）になっているか
     - `display`: `block`になっているか
   - Stylesタブで`style={{ height: "100%" }}`が適用されているか確認

4. **OutlinedInput要素の確認**
   - `NumberField.Root`の子要素である`OutlinedInput`（`.MuiOutlinedInput-root`）を選択
   - Computedタブで以下を確認：
     - `height`: `100%`が計算されて親の高さ（40px/60px）になっているか
   - Stylesタブで`sx={{ height: "100%" }}`が適用されているか確認

5. **input要素の確認**
   - `OutlinedInput`の子要素である`input`（`.MuiOutlinedInput-input`）を選択
   - Computedタブで以下を確認：
     - `height`: `100%`が計算されて親の高さを参照しているか
   - Stylesタブで`height: "100%"`が適用されているか確認

6. **高さの比較**
   - 2つの`BasicVSpinner`（40px/60px）の実際の高さを比較
   - 視覚的に高さが異なることを確認

### 期待される結果

修正後、以下のようになるはずです：
- `NumberField.Root`の`height`が`100%`（親の高さを参照）
- `OutlinedInput`の`height`が`100%`（親の高さを参照）
- 実際の高さが40px/60pxになっている
- 2つの入力フィールドの高さが視覚的に異なる

### 問題が解決しない場合の追加調査

もし修正後も問題が解決しない場合は、以下を確認：
1. `Box`の`display`プロパティが高さの伝播に影響していないか
2. `NumberField.Root`の`display`プロパティが`block`以外になっていないか
3. 他のCSSルールが高さを上書きしていないか
4. `OutlinedInput`の`minHeight`や`maxHeight`が影響していないか
