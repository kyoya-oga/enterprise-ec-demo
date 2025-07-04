'use client';

import React from 'react';
import { Button } from '@/components/ui';
import { CartItem } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface CartItemControlsProps {
  item: CartItem;
  onUpdateQuantity?: (id: number, quantity: number) => Promise<void>;
  onRemove?: (id: number) => Promise<void>;
  isLoading?: boolean;
}

export function CartItemControls({ item, onUpdateQuantity, onRemove, isLoading = false }: CartItemControlsProps) {
  const handleDecrease = async () => {
    if (item.quantity > 1) {
      await onUpdateQuantity?.(item.id, item.quantity - 1);
    } else {
      await onRemove?.(item.id);
    }
  };

  const handleIncrease = async () => {
    await onUpdateQuantity?.(item.id, item.quantity + 1);
  };

  const handleRemove = async () => {
    await onRemove?.(item.id);
  };

  if (isLoading) {
    return <LoadingSpinner size="sm" />
  }

  return (
    <>
      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecrease}
          disabled={isLoading}
          className="w-8 h-8 p-0 hover:bg-red-50 hover:border-red-200 disabled:opacity-50"
          aria-label="minus"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </Button>
        
        <span className="w-8 text-center font-medium text-zinc-900 dark:text-slate-200">
          {item.quantity}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleIncrease}
          disabled={isLoading}
          className="w-8 h-8 p-0 hover:bg-red-50 hover:border-red-200 disabled:opacity-50"
          aria-label="plus"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Button>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemove}
        disabled={isLoading}
        className="w-8 h-8 p-0 text-zinc-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </Button>
    </>
  );
}