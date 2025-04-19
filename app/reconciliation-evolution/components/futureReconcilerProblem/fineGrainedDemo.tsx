'use client';

import { useState, useEffect } from 'react';

export default function FineGrainedDemo({ 
  animationStep, 
  isPlaying 
}: { 
  animationStep: number;
  isPlaying: boolean;
}) {
  // Demo state for fine-grained reactivity example
  const [reactCounter, setReactCounter] = useState(0);
  const [solidCounter, setSolidCounter] = useState(0);
  const [showReactRenders, setShowReactRenders] = useState(false);
  
  // Animate demo based on animation step
  useEffect(() => {
    // Fine-grained reactivity animation
    if (animationStep === 1) {
      setReactCounter(prev => prev + 1);
      setSolidCounter(prev => prev + 1);
      setShowReactRenders(true);
    } else if (animationStep === 2) {
      setShowReactRenders(false);
    }
  }, [animationStep]);
  
  const resetDemo = () => {
    setReactCounter(0);
    setSolidCounter(0);
    setShowReactRenders(false);
  };

  useEffect(() => {
    if (!isPlaying) {
      resetDemo();
    }
  }, [isPlaying]);

  return (
    <div className="mb-6 p-6 bg-yellow-50 text-black rounded-lg border border-yellow-200">
      <h3 className="text-xl font-medium mb-3">Challenge 1: Fine-Grained Reactivity</h3>
      <p className="mb-4">React's component-based updates vs. SolidJS/Svelte fine-grained reactive approach:</p>
      
      <div className="flex space-x-4 mb-6">
        <div className="w-1/2 p-4 border border-gray-300 rounded-lg bg-white">
          <h4 className="font-medium mb-3">React Approach</h4>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3 relative">
            <div className="flex justify-between items-center">
              <div>Counter: <span className="font-bold">{reactCounter}</span></div>
              <button 
                className="px-2 py-1 bg-blue-500 text-white text-sm rounded"
                onClick={() => setReactCounter(reactCounter + 1)}
              >
                Increment
              </button>
            </div>
            
            {/* Visualization of React re-rendering the entire component */}
            {showReactRenders && (
              <div className="absolute inset-0 bg-blue-100 bg-opacity-60 flex items-center justify-center rounded-lg border border-blue-300 animate-pulse">
                <div className="text-black font-medium">Re-rendering entire component</div>
              </div>
            )}
          </div>
          
          <div className="bg-slate-800 text-black p-3 rounded-md mb-3 text-xs">
            <pre>
              <code>{`function ReactCounter() {
  const [count, setCount] = useState(0);
  
  // The ENTIRE component re-renders
  // on every state change
  return (
    <div>
      <span>Counter: {count}</span>
      <button onClick={() => 
        setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`}</code>
            </pre>
          </div>
          
          <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-sm">
            <p><strong>Challenge:</strong> React updates at component level, causing unnecessary re-renders of DOM nodes that haven't changed.</p>
          </div>
        </div>
        
        <div className="w-1/2 p-4 border border-gray-300 rounded-lg bg-white">
          <h4 className="font-medium mb-3">SolidJS/Svelte Approach</h4>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-3 relative">
            <div className="flex justify-between items-center">
              <div>
                Counter: <span className={`font-bold ${animationStep === 1 ? 'animate-pulse bg-green-200 px-1 rounded' : ''}`}>{solidCounter}</span>
              </div>
              <button 
                className="px-2 py-1 bg-green-500 text-white text-sm rounded"
                onClick={() => setSolidCounter(solidCounter + 1)}
              >
                Increment
              </button>
            </div>
          </div>
          
          <div className="bg-slate-800 text-black p-3 rounded-md mb-3 text-xs">
            <pre>
              <code>{`function SolidCounter() {
  const [count, setCount] = createSignal(0);
  
  // Only this text node updates
  // Not the entire component
  return (
    <div>
      <span>Counter: {count()}</span>
      <button onClick={() => 
        setCount(count() + 1)}>
        Increment
      </button>
    </div>
  );
}`}</code>
            </pre>
          </div>
          
          <div className="p-3 bg-green-100 border border-green-300 rounded-lg text-sm">
            <p><strong>Advantage:</strong> Only updates the exact DOM nodes that change, leading to better performance and less wasted rendering.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-300">
        <h4 className="font-medium mb-2">Performance Comparison</h4>
        <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden mb-2">
          <div className="absolute inset-y-0 left-0 bg-blue-500 transition-all duration-300" style={{ width: `${20 + reactCounter * 10}%` }}>
            <span className="absolute right-0 transform translate-x-full ml-2 text-sm">React: More work</span>
          </div>
        </div>
        <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden mb-2">
          <div className="absolute inset-y-0 left-0 bg-green-500 transition-all duration-300" style={{ width: `${10 + solidCounter * 5}%` }}>
            <span className="absolute right-0 transform translate-x-full ml-2  text-sm">SolidJS: Less work</span>
          </div>
        </div>
      </div>
    </div>
  );
}