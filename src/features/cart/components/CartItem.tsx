import React from 'react';
import { CartItem as CartItemType } from '../types';
import { CartItemDisplay } from './CartItemDisplay';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity?: (id: number, quantity: number) => Promise<void>;
  onRemove?: (id: number) => Promise<void>;
  isLoading?: boolean;
}

export function CartItem({ item, onUpdateQuantity, onRemove, isLoading }: CartItemProps) {
  return (
    <CartItemDisplay
      item={item}
      onUpdateQuantity={onUpdateQuantity}
      onRemove={onRemove}
      isLoading={isLoading}
    />
  );
}