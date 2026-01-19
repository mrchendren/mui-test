# 実装比較：MUI RadioGroup vs HTML標準ラジオボタン

## 現在の実装（MUI RadioGroup使用）

### コード量
- **見えないラジオボタン部分**: 約50行（254-291行目）
- **useEffect（changeイベント発火）**: 約15行（114-128行目）
- **合計**: 約65行

### 実装の特徴
```tsx
// 見えないラジオボタン部分（254-291行目）
<RadioGroup
    name={hiddenName}
    value={current}  // ← 制御コンポーネント
    onChange={(e) => {
        setHiddenGroupValues((prev) => ({
            ...prev,
            [target]: e.target.value,
        }));
    }}
    sx={{ ... }}
>
    {switchIds.map((sid) => (
        <FormControlLabel
            key={sid}
            value={sid}
            control={<Radio size="small" sx={{ ... }} />}
            label={sid}
            sx={{ ... }}
        />
    ))}
</RadioGroup>

// hiddenGroupValues変更時の処理（114-128行目）
useEffect(() => {
    for (const target of Object.keys(hiddenGroupValues)) {
        const groupName = `${target}_${dispid}`;
        const value = hiddenGroupValues[target];
        
        // DOM要素を探してchangeイベントを発火
        const input = document.querySelector<HTMLInputElement>(
            `input[name="${groupName}"][value="${value}"]`
        );
        if (input) {
            input.checked = true;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
}, [dispid, hiddenGroupValues]);
```

### 必要な依存関係
- `@mui/material` の `RadioGroup`, `FormControlLabel`, `Radio`

### 問題点
1. **MUIの制御コンポーネント**のため、`value`と`onChange`が必要
2. **React状態とDOMの二重管理**が必要
3. **useEffectでDOM操作**が必要（Reactの思想から外れる）
4. **コード量が多い**（MUIコンポーネントのラッパーが多い）

---

## HTML標準ラジオボタンを使った実装

### コード量
- **見えないラジオボタン部分**: 約20行
- **useEffect（changeイベント発火）**: 約15行（同じ）
- **合計**: 約35行

### 実装例
```tsx
// 見えないラジオボタン部分
<div style={{ display: VISIBLE_DEBUG ? 'flex' : 'none', gap: '8px', flexWrap: 'wrap' }}>
    <Chip
        size="small"
        color="primary"
        variant="outlined"
        label={`Group: ${hiddenName}`}
        sx={{ mb: 0.5, fontSize: 11 }}
    />
    {switchIds.map((sid) => (
        <label key={sid} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
                type="radio"
                name={hiddenName}
                value={sid}
                defaultChecked={sid === current}  // ← 非制御コンポーネント
                onChange={(e) => {
                    if (e.target.checked) {
                        setHiddenGroupValues((prev) => ({
                            ...prev,
                            [target]: sid,
                        }));
                    }
                }}
            />
            <span style={{ fontSize: 12, color: '#1976d2' }}>{sid}</span>
        </label>
    ))}
</div>

// hiddenGroupValues変更時の処理（同じ）
useEffect(() => {
    for (const target of Object.keys(hiddenGroupValues)) {
        const groupName = `${target}_${dispid}`;
        const value = hiddenGroupValues[target];
        
        const input = document.querySelector<HTMLInputElement>(
            `input[name="${groupName}"][value="${value}"]`
        );
        if (input) {
            input.checked = true;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
}, [dispid, hiddenGroupValues]);
```

### 必要な依存関係
- **MUI不要**（見えないラジオボタン部分のみ）
- または、スタイリングのために`Box`や`Chip`のみ使用可能

### メリット
1. **コード量が約40%削減**（65行 → 35行）
2. **非制御コンポーネント**のため、DOM操作が自然
3. **MUIの依存が不要**（見えないラジオボタン部分のみ）
4. **シンプルなHTML構造**で理解しやすい
5. **パフォーマンス向上**（MUIコンポーネントのオーバーヘッドがない）

### デメリット
1. **スタイリングを自分で実装**する必要がある（ただし見えないので最小限でOK）
2. **MUIの統一感**が失われる（ただし見えないので問題なし）

---

## 比較まとめ

| 項目 | MUI RadioGroup | HTML標準 |
|------|---------------|----------|
| **コード行数** | 約65行 | 約35行 |
| **削減率** | - | **約40%削減** |
| **依存関係** | MUI必須 | MUI不要 |
| **制御方式** | 制御コンポーネント | 非制御コンポーネント |
| **DOM操作** | useEffectで必要 | useEffectで必要（同じ） |
| **スタイリング** | MUIが自動適用 | 自分で実装 |
| **可読性** | MUIのラッパーで複雑 | シンプルなHTML |
| **パフォーマンス** | MUIのオーバーヘッド | 軽量 |

---

## 推奨

**HTML標準ラジオボタンを使用することを推奨します。**

理由：
1. **見えない要素**なので、MUIのスタイリングは不要
2. **コード量が大幅に削減**され、保守性が向上
3. **非制御コンポーネント**のため、DOM操作が自然
4. **既存システムのアーキテクチャ**（DOMベース）により適合
