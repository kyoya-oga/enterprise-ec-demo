# カートページ機能実装計画

## 現在の実装状況

### 完了済み
- ✅ UIコンポーネント（表示のみ）
- ✅ TypeScript型定義
- ✅ 基本的なページレイアウト

### 実装済みコンポーネント
- `CartItem` - カートアイテム表示
- `CartItemDisplay` - アイテム詳細表示
- `CartItemControls` - 数量操作ボタン（未実装）
- `CartSummary` - 注文サマリー表示
- `EmptyCart` - 空カート表示

## 実装が必要な機能

### 1. 状態管理の実装
**優先度: 高**

**選択: Zustand**（軽量、TypeScript完全対応、最小依存方針に合致）

- Zustandストアでカート状態管理
- `src/features/cart/store/useCartStore.ts` を作成
- カートアイテムの追加/削除/更新機能
- persist middleware でローカルストレージ永続化

```typescript
// Zustand store
const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => ({ 
        items: [...state.items, item] 
      })),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
    }),
    { name: 'cart-storage' }
  )
)
```

**他の選択肢との比較**:
- Context API: ボイラープレート多、パフォーマンス課題
- Jotai: より複雑、カートには過剰
- TanStack Query: サーバー状態管理が主目的

### 2. カートアイテム操作機能
**優先度: 高**

#### 2.1 数量変更機能
- `CartItemControls` コンポーネントの実装
- 数量増減ボタンの動作
- 数量0での自動削除

#### 2.2 アイテム削除機能
- 削除ボタンの実装
- 削除確認ダイアログ（オプション）

### 3. 商品追加機能の連携
**優先度: 高**

- `AddToCartButton` の実装確認
- 商品詳細ページからの追加動作
- 成功/エラー状態の表示

### 4. 価格計算の改善
**優先度: 中**

- 税金計算の実装
- 送料計算ロジック
- 割引・クーポン機能（将来的）

### 5. チェックアウト連携
**優先度: 中**

- チェックアウトページへの遷移
- カート情報の引き継ぎ
- 在庫チェック機能

### 6. エラーハンドリング
**優先度: 中**

- ネットワークエラー対応
- 在庫不足エラー
- ユーザーフレンドリーなエラー表示

### 7. パフォーマンス最適化
**優先度: 低**

- React.memo による最適化
- 不要な再レンダリング防止
- 大量アイテム時の仮想化

## 実装手順

### フェーズ1: 状態管理基盤
1. CartContext の作成
2. useCart hook の実装
3. ローカルストレージ連携

### フェーズ2: 基本操作機能
1. 数量変更機能
2. アイテム削除機能
3. 商品追加連携

### フェーズ3: 高度な機能
1. 価格計算改善
2. エラーハンドリング
3. チェックアウト連携

### フェーズ4: 最適化
1. パフォーマンス改善
2. ユーザビリティ向上
3. アクセシビリティ対応

## 技術実装詳細

### 状態管理アーキテクチャ
```typescript
// Zustand store型定義
interface CartStore {
  items: CartItem[]
  loading: boolean
  error: string | null
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  
  // Computed values
  subtotal: number
  total: number
  itemCount: number
}
```

### 必要なファイル
```
src/features/cart/
├── store/
│   ├── useCartStore.ts       # Zustand store
│   └── index.ts              # exports
├── hooks/
│   ├── useCartActions.ts     # 便利なaction hooks
│   ├── useCartCalculations.ts # 計算ロジック
│   └── index.ts             # exports
├── utils/
│   ├── cartCalculations.ts   # 価格計算ユーティリティ
│   └── index.ts             # exports
```

### 依存関係
```bash
npm install zustand
# persist middleware は zustand に含まれる
```

### テスト戦略
- 各コンポーネントの単体テスト
- Context/hooks の統合テスト
- ユーザーフロー全体のE2Eテスト

## 完了の定義

### 最小機能要件
- [ ] アイテムの追加/削除/数量変更
- [ ] 価格計算の正確性
- [ ] ローカルストレージ永続化
- [ ] エラーハンドリング

### 品質要件
- [ ] TypeScript型安全性
- [ ] 80%以上のテストカバレッジ
- [ ] アクセシビリティ対応
- [ ] レスポンシブデザイン

## 推定工数
- フェーズ1: 2-3日
- フェーズ2: 2-3日  
- フェーズ3: 3-4日
- フェーズ4: 1-2日

**総計: 8-12日**

## 注意事項
- 既存のUIデザインを維持する
- 国際化（i18n）対応を考慮
- SEO影響を最小限に抑える
- モバイルファーストで実装