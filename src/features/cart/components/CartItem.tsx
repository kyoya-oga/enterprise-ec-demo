import { CartItem as CartItemType } from '../types';
import { CartItemDisplay } from './CartItemDisplay';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity?: (id: number, quantity: number) => void;
  onRemove?: (id: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <CartItemDisplay
      item={item}
      onUpdateQuantity={onUpdateQuantity}
      onRemove={onRemove}
    />
  );
}