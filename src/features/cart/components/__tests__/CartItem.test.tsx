import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartItem } from '@/features/cart/components/CartItem';
import type { CartItem as CartItemType } from '@/features/cart/types';

// Mock the CartItemDisplay component since CartItem is just a wrapper
vi.mock('@/features/cart/components/CartItemDisplay', () => ({
  CartItemDisplay: ({ item, onUpdateQuantity, onRemove }: any) => (
    <div data-testid="cart-item-display">
      <span data-testid="item-name">{item.name}</span>
      <span data-testid="item-quantity">{item.quantity}</span>
      <span data-testid="item-price">{item.price}</span>
      <button
        data-testid="update-quantity-btn"
        onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
      >
        Update Quantity
      </button>
      <button data-testid="remove-btn" onClick={() => onRemove?.(item.id)}>
        Remove
      </button>
    </div>
  ),
}));

describe('カートアイテム', () => {
  const mockItem: CartItemType = {
    id: 1,
    productId: 1,
    name: 'テスト商品',
    price: 1000,
    quantity: 2,
    image: '/test-image.jpg',
  };

  const mockOnUpdateQuantity = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('レンダリング', () => {
    test('正しいpropsでCartItemDisplayをレンダリングする', () => {
      render(
        <CartItem
          item={mockItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      expect(screen.getByTestId('cart-item-display')).toBeInTheDocument();
      expect(screen.getByTestId('item-name')).toHaveTextContent('テスト商品');
      expect(screen.getByTestId('item-quantity')).toHaveTextContent('2');
      expect(screen.getByTestId('item-price')).toHaveTextContent('1000');
    });

    test('オプションのコールバックなしでレンダリングする', () => {
      render(<CartItem item={mockItem} />);

      expect(screen.getByTestId('cart-item-display')).toBeInTheDocument();
      expect(screen.getByTestId('item-name')).toHaveTextContent('テスト商品');
    });
  });

  describe('Props転送', () => {
    test('itemプロパティを正しく転送する', () => {
      const customItem: CartItemType = {
        id: 2,
        productId: 2,
        name: 'カスタム商品',
        price: 2500,
        quantity: 3,
        image: '/custom-image.jpg',
      };

      render(
        <CartItem
          item={customItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      expect(screen.getByTestId('item-name')).toHaveTextContent('カスタム商品');
      expect(screen.getByTestId('item-quantity')).toHaveTextContent('3');
      expect(screen.getByTestId('item-price')).toHaveTextContent('2500');
    });

    test('onUpdateQuantityコールバックを転送する', () => {
      render(
        <CartItem
          item={mockItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      const updateButton = screen.getByTestId('update-quantity-btn');
      fireEvent.click(updateButton);

      expect(mockOnUpdateQuantity).toHaveBeenCalledWith(1, 3); // quantity 2 + 1
    });

    test('onRemoveコールバックを転送する', () => {
      render(
        <CartItem
          item={mockItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      const removeButton = screen.getByTestId('remove-btn');
      fireEvent.click(removeButton);

      expect(mockOnRemove).toHaveBeenCalledWith(1);
    });
  });

  describe('オプションprops処理', () => {
    test('onUpdateQuantityの欠如を適切に処理する', () => {
      render(<CartItem item={mockItem} onRemove={mockOnRemove} />);

      const updateButton = screen.getByTestId('update-quantity-btn');

      expect(() => {
        fireEvent.click(updateButton);
      }).not.toThrow();
    });

    test('onRemoveの欠如を適切に処理する', () => {
      render(
        <CartItem item={mockItem} onUpdateQuantity={mockOnUpdateQuantity} />
      );

      const removeButton = screen.getByTestId('remove-btn');

      expect(() => {
        fireEvent.click(removeButton);
      }).not.toThrow();
    });

    test('両方のコールバックが欠如している場合を処理する', () => {
      render(<CartItem item={mockItem} />);

      const updateButton = screen.getByTestId('update-quantity-btn');
      const removeButton = screen.getByTestId('remove-btn');

      expect(() => {
        fireEvent.click(updateButton);
        fireEvent.click(removeButton);
      }).not.toThrow();
    });
  });

  describe('アイテムバリエーション', () => {
    test('画像がないアイテムを処理する', () => {
      const itemWithoutImage = { ...mockItem, image: undefined };

      render(
        <CartItem
          item={itemWithoutImage}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      expect(screen.getByTestId('cart-item-display')).toBeInTheDocument();
    });

    test('価格ゼロのアイテムを処理する', () => {
      const freeItem = { ...mockItem, price: 0 };

      render(
        <CartItem
          item={freeItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      expect(screen.getByTestId('item-price')).toHaveTextContent('0');
    });

    test('数量1のアイテムを処理する', () => {
      const singleItem = { ...mockItem, quantity: 1 };

      render(
        <CartItem
          item={singleItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      expect(screen.getByTestId('item-quantity')).toHaveTextContent('1');
    });

    test('大量のアイテムを処理する', () => {
      const bulkItem = { ...mockItem, quantity: 999 };

      render(
        <CartItem
          item={bulkItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      expect(screen.getByTestId('item-quantity')).toHaveTextContent('999');
    });
  });

  describe('エッジケース', () => {
    test('ID 0のアイテムを処理する', () => {
      const itemWithZeroId = { ...mockItem, id: 0 };

      render(
        <CartItem
          item={itemWithZeroId}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      const removeButton = screen.getByTestId('remove-btn');
      fireEvent.click(removeButton);

      expect(mockOnRemove).toHaveBeenCalledWith(0);
    });

    test('負の価格のアイテムを処理する', () => {
      const itemWithNegativePrice = { ...mockItem, price: -100 };

      render(
        <CartItem
          item={itemWithNegativePrice}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      expect(screen.getByTestId('item-price')).toHaveTextContent('-100');
    });

    test('非常に長い名前のアイテムを処理する', () => {
      const itemWithLongName = {
        ...mockItem,
        name: 'これは非常に長い商品名でテストの目的で使用されています。この名前は通常の商品名よりもかなり長く設定されています。',
      };

      render(
        <CartItem
          item={itemWithLongName}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      expect(screen.getByTestId('item-name')).toHaveTextContent(
        itemWithLongName.name
      );
    });

    test('名前に特殊文字を含むアイテムを処理する', () => {
      const itemWithSpecialChars = {
        ...mockItem,
        name: '特殊文字テスト: !@#$%^&*()_+{}|:"<>?[]\\;\',./',
      };

      render(
        <CartItem
          item={itemWithSpecialChars}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      expect(screen.getByTestId('item-name')).toHaveTextContent(
        itemWithSpecialChars.name
      );
    });
  });

  describe('コンポーネントラッパー機能', () => {
    test('適切なラッパーコンポーネントとして動作する', () => {
      // This test verifies that CartItem doesn't add any additional logic
      // and just passes through all props to CartItemDisplay

      const { rerender } = render(
        <CartItem
          item={mockItem}
          onUpdateQuantity={mockOnUpdateQuantity}
          onRemove={mockOnRemove}
        />
      );

      expect(screen.getByTestId('cart-item-display')).toBeInTheDocument();

      // Rerender with different props
      const newItem = { ...mockItem, name: '新商品' };
      const newUpdateCallback = vi.fn();

      rerender(
        <CartItem
          item={newItem}
          onUpdateQuantity={newUpdateCallback}
          onRemove={mockOnRemove}
        />
      );

      expect(screen.getByTestId('item-name')).toHaveTextContent('新商品');
    });
  });
});
