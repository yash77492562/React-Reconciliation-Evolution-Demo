// app/reconciliation-evolution/components/ReconciliationDemo.tsx
'use client';

import { useState, useEffect } from 'react';

interface Item {
  id: number;
  text: string;
}

export default function ReconciliationDemo() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLegacyMode, setIsLegacyMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate adding many items at once
  const addManyItems = () => {
    setIsLoading(true);
    
    if (isLegacyMode) {
      // Simulate blocking render in legacy mode
      const newItems = [...items];
      for (let i = 0; i < 1000; i++) {
        newItems.push({ id: Date.now() + i, text: `Item ${items.length + i + 1}` });
      }
      setItems(newItems);
      setIsLoading(false);
    } else {
      // Modern mode - use setTimeout to simulate non-blocking updates
      setTimeout(() => {
        const newItems = [...items];
        for (let i = 0; i < 1000; i++) {
          newItems.push({ id: Date.now() + i, text: `Item ${items.length + i + 1}` });
        }
        setItems(newItems);
        setIsLoading(false);
      }, 0);
    }
  };

  // Clear items
  const clearItems = () => {
    setItems([]);
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <h3 className="text-xl font-bold mb-4">Interactive Demo</h3>
      
      <div className="flex gap-4 mb-4">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={addManyItems}
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add 1000 Items'}
        </button>
        
        <button 
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={clearItems}
        >
          Clear Items
        </button>
        
        <label className="flex items-center">
          <input 
            type="checkbox" 
            checked={isLegacyMode}
            onChange={() => setIsLegacyMode(!isLegacyMode)}
            className="mr-2"
          />
          Simulate Legacy Mode
        </label>
      </div>
      
      <div className="border border-gray-200 rounded h-64 overflow-auto p-2">
        {items.length === 0 ? (
          <p className="text-gray-500">No items. Click "Add 1000 Items" to test.</p>
        ) : (
          <ul>
            {items.map(item => (
              <li key={item.id} className="py-1 border-b border-gray-100">
                {item.text}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <p className="mt-2 text-sm text-gray-600">
        Total items: {items.length}
      </p>
    </div>
  );
}