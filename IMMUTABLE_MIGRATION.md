# 🔒 イミュータブル移行戦略

このドキュメントは、コードベースを段階的にイミュータブルな処理に移行するための戦略を説明します。

## 📋 移行フェーズ概要

### ✅ Phase 1: `let`禁止 (現在アクティブ)
**目標**: 再代入を禁止し、`const`のみの使用を強制

**現在の状態**:
- ✅ メインコードで`let`使用時にエラー
- ⚠️  テストファイルで`let`使用時に警告
- ✅ `var`は完全禁止

**リントルール**:
```javascript
"VariableDeclaration[kind='let']" -> error
```

---

### 🟡 Phase 2: 配列ミューテーション禁止 (準備完了)
**目標**: 配列を変更するメソッドを禁止し、イミュータブルな代替手段を強制

**対象メソッドと代替案**:
```javascript
// ❌ 禁止される操作
array.push(item)     // → [...array, item]
array.pop()          // → array.slice(0, -1)
array.shift()        // → array.slice(1)
array.unshift(item)  // → [item, ...array]
array.splice(i, 1)   // → [...array.slice(0, i), ...array.slice(i + 1)]
array.sort()         // → [...array].sort() or array.toSorted()
array.reverse()      // → [...array].reverse() or array.toReversed()
```

**アクティベーション手順**:
1. `.eslintrc.json` の配列ミューテーションルールをアンコメント
2. エラーレベルを `"error"` に変更
3. 既存コードを修正
4. テスト実行

---

### 🔴 Phase 3: オブジェクトミューテーション禁止 (計画中)
**目標**: オブジェクトプロパティの直接変更を禁止

**対象操作と代替案**:
```javascript
// ❌ 禁止される操作
obj.prop = value           // → { ...obj, prop: value }
Object.assign(obj, props)  // → { ...obj, ...props }
delete obj.prop            // → const { prop, ...rest } = obj
```

**必要な準備**:
- Phase 2の完了
- インターフェースに`readonly`修飾子の追加
- 既存オブジェクト操作の調査

---

### 🚀 Phase 4: 完全関数型プログラミング (将来)
**目標**: 純粋関数の強制、副作用の完全排除

**追加ルール**:
```javascript
// パラメータの変更禁止
"no-param-reassign": ["error", { "props": true }]

// 読み取り専用パラメータ型
"@typescript-eslint/prefer-readonly-parameter-types": "error"

// Readonly インターフェース強制
"@typescript-eslint/prefer-readonly": "error"
```

## 🛠️ 段階的移行の実行手順

### Phase 2への移行
1. **現状調査**:
   ```bash
   npm run lint | grep "Future:"
   ```

2. **ルール有効化**:
   `.eslintrc.json` で以下を変更:
   ```json
   // これを変更
   "message": "⚠️  Future: Use spread operator"
   // このように
   "message": "❌ Use spread operator [...array, newItem] instead of push()"
   ```

3. **コード修正**:
   - 配列ミューテーションを関数型スタイルに変更
   - ユニットテストで動作確認

4. **完了確認**:
   ```bash
   npm run lint    # エラーゼロを確認
   npm run test    # 全テスト通過を確認
   ```

### Phase 3への移行
1. **Phase 2完了確認**
2. **オブジェクトミューテーション調査**:
   ```bash
   # 既存のオブジェクト変更を検索
   grep -r "\..*=" src/ --include="*.ts" --include="*.tsx"
   ```

3. **インターフェース更新**:
   ```typescript
   // Before
   interface User {
     name: string
     age: number
   }

   // After
   interface User {
     readonly name: string
     readonly age: number
   }
   ```

4. **ルール有効化と修正**

## 📊 進捗トラッキング

### 現在の状況
- [x] Phase 1: `let`禁止 - **完了**
- [ ] Phase 2: 配列ミューテーション禁止 - **準備完了**
- [ ] Phase 3: オブジェクトミューテーション禁止 - **計画中**
- [ ] Phase 4: 完全関数型 - **将来**

### 各Phaseの成功指標
| Phase | 指標 | 現在値 | 目標値 |
|-------|------|--------|--------|
| 1 | `let`使用箇所 | 4箇所(テストのみ警告) | 0箇所 |
| 2 | 配列ミューテーション | 未調査 | 0箇所 |
| 3 | オブジェクトミューテーション | 未調査 | 0箇所 |
| 4 | 純粋関数率 | 未調査 | 90%+ |

## 🔧 開発者向けチートシート

### イミュータブルパターン集
```typescript
// 配列操作
const addItem = (arr: readonly T[], item: T): readonly T[] => [...arr, item]
const removeItem = (arr: readonly T[], index: number): readonly T[] => 
  [...arr.slice(0, index), ...arr.slice(index + 1)]
const updateItem = (arr: readonly T[], index: number, item: T): readonly T[] =>
  [...arr.slice(0, index), item, ...arr.slice(index + 1)]

// オブジェクト操作
const updateProperty = <T>(obj: T, updates: Partial<T>): T => ({ ...obj, ...updates })
const removeProperty = <T, K extends keyof T>(obj: T, key: K): Omit<T, K> => {
  const { [key]: _, ...rest } = obj
  return rest
}

// ネストした更新
const updateNested = (state: State, path: string[], value: any): State => {
  if (path.length === 1) {
    return { ...state, [path[0]]: value }
  }
  const [head, ...tail] = path
  return {
    ...state,
    [head]: updateNested(state[head], tail, value)
  }
}
```

## ⚠️ 注意事項

1. **パフォーマンス**: 大きな配列/オブジェクトの場合、スプレッド演算子は性能に影響する可能性があります
2. **メモリ使用量**: イミュータブル操作は一時的にメモリ使用量が増加します
3. **学習コスト**: チーム全体の関数型プログラミングへの理解が必要です

## 📚 参考資料

- [Immutable Update Patterns](https://redux.js.org/usage/structuring-reducers/immutable-update-patterns)
- [ESLint Functional Programming Rules](https://github.com/eslint-functional/eslint-plugin-functional)
- [TypeScript Readonly Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties)