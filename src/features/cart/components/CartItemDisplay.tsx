import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { CartItem } from '../types';
import { CartItemControls } from './CartItemControls';

interface CartItemDisplayProps {
  item: CartItem;
  onUpdateQuantity?: (id: number, quantity: number) => void;
  onRemove?: (id: number) => void;
}

export function CartItemDisplay({ item, onUpdateQuantity, onRemove }: CartItemDisplayProps) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg overflow-hidden">
              <Image
                src={item.image ?? '/images/placeholder.jpg'}
                alt={item.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100 truncate mb-1">
              {item.name}
            </h3>
            <p className="text-lg font-semibold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              {formatPrice(item.price)}
            </p>
          </div>

          {/* Quantity Controls & Remove Button */}
          <CartItemControls
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        </div>

        {/* Subtotal Row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-700">
          <span className="text-sm text-zinc-600">
            小計 ({item.quantity}個)
          </span>
          <span className="font-semibold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}