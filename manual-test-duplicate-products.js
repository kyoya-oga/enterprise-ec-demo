// 手動テスト：同じ商品の重複追加を確認
// ブラウザのコンソールで実行してください

console.log('=== 同じ商品重複追加テスト開始 ===');

// ダミーデータ
const mockProduct = {
  id: 1,
  name: 'テスト商品',
  price: 1000,
  stock: 20,
  image: '/test.jpg'
};

const createCartItem = (quantity) => ({
  id: mockProduct.id, // 同じproductId
  productId: mockProduct.id,
  name: mockProduct.name,
  price: mockProduct.price,
  quantity,
  image: mockProduct.image
});

// カートストアを取得
const { addItem, clearCart } = window.useCartStore?.getState() || {};

if (!addItem) {
  console.error('カートストアが見つかりません');
} else {
  // テスト実行
  (async () => {
    console.log('1. カートをクリア');
    clearCart();
    
    console.log('2. 同じ商品を2個追加');
    await addItem(createCartItem(2));
    let state = window.useCartStore.getState();
    console.log('カート状態:', state.items);
    console.log('アイテム数:', state.items.length, '合計数量:', state.itemCount);
    
    console.log('3. 同じ商品をさらに3個追加（合計5個になるはず）');
    await addItem(createCartItem(3));
    state = window.useCartStore.getState();
    console.log('カート状態:', state.items);
    console.log('アイテム数:', state.items.length, '合計数量:', state.itemCount);
    
    if (state.items.length === 1 && state.itemCount === 5) {
      console.log('✅ テスト成功: 同じ商品が正しく統合されました');
    } else {
      console.log('❌ テスト失敗: 期待される結果と異なります');
    }
    
    console.log('=== テスト完了 ===');
  })();
}