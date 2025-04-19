// app/reconciliation-evolution/components/ModernReconcilerDemo.tsx
'use client';

import { useState, useEffect, useRef, useTransition } from 'react';

export default function ModernReconcilerDemo() {
  // Animation state
  const [animationStep, setAnimationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeDemo, setActiveDemo] = useState('stack'); // 'stack', 'type', or 'dom'
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Stack reconciler solution state
  const [counter, setCounter] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState([
    { id: 1, text: "Item 1" },
    { id: 2, text: "Item 2" },
    { id: 3, text: "Item 3" }
  ]);
  const counterIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Component type solution state
  const [containerType, setContainerType] = useState('div');
  const [counterValue, setCounterValue] = useState(1);
  
  // DOM updates solution state
  const [listItems, setListItems] = useState([
    { id: 1, text: "Item 1" },
    { id: 2, text: "Item 2" },
    { id: 3, text: "Item 3" }
  ]);
  
  // Counter effect for UI responsiveness demonstration
  useEffect(() => {
    counterIntervalRef.current = setInterval(() => {
      setCounter(c => c + 1);
    }, 100);
    
    return () => {
      if (counterIntervalRef.current) {
        clearInterval(counterIntervalRef.current);
      }
    };
  }, []);
  
  // Animation control
  useEffect(() => {
    if (isPlaying) {
      animationIntervalRef.current = setInterval(() => {
        setAnimationStep(prev => (prev < 5 ? prev + 1 : 0));
      }, 1500);
      return () => {
        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current);
        }
      };
    }
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [isPlaying]);
  
  // Synchronize step changes with demo state
  useEffect(() => {
    if (activeDemo === 'stack') {
      // Stack reconciler demo sync
      if (animationStep >= 2 && animationStep <= 3) {
        setIsProcessing(true);
      } else {
        setIsProcessing(false);
      }
    }
    else if (activeDemo === 'type') {
      // Component type demo sync
      if (animationStep >= 3) {
        setContainerType('span');
        setCounterValue(prev => prev + 1); // Counter continues incrementing
      } else {
        setContainerType('div');
        setCounterValue(animationStep + 1);
      }
    }
    else if (activeDemo === 'dom') {
      // DOM updates demo sync
      if (animationStep >= 2) {
        const newItem = { id: Date.now(), text: "New Item" };
        setListItems(prev => [newItem, ...prev]);
      }
    }
  }, [animationStep, activeDemo]);
  
  // Add item with fiber reconciliation (non-blocking)
  const addItemWithFiber = () => {
    setIsProcessing(true);
    setAnimationStep(2);
    
    // Use startTransition to mark this as non-urgent update
    startTransition(() => {
      // This would ordinarily block the main thread in the old reconciler
      setTimeout(() => {
        setItems(prev => [
          { id: Date.now(), text: `New Item ${prev.length + 1}` }, 
          ...prev
        ]);
        
        setAnimationStep(4);
        
        setTimeout(() => {
          setIsProcessing(false);
          setAnimationStep(5);
        }, 500);
      }, 100);
    });
  };
  
  // Change container type with React's improved reconciliation
  const toggleContainerType = () => {
    if (animationStep < 3) {
      setAnimationStep(3);
      setContainerType('span');
    } else {
      setAnimationStep(0);
      setContainerType('div');
    }
  };
  
  // Add item to list with key-based optimization
  const addItemToList = () => {
    setAnimationStep(2);
    startTransition(() => {
      const newItem = { id: Date.now(), text: "New Item" };
      setListItems(prev => [newItem, ...prev]);
      
      setTimeout(() => {
        setAnimationStep(3);
      }, 1000);
    });
  };
  
  const resetDemo = () => {
    setAnimationStep(0);
    setIsProcessing(false);
    setItems([
      { id: 1, text: "Item 1" },
      { id: 2, text: "Item 2" },
      { id: 3, text: "Item 3" }
    ]);
    setContainerType('div');
    setCounterValue(1);
    setListItems([
      { id: 1, text: "Item 1" },
      { id: 2, text: "Item 2" },
      { id: 3, text: "Item 3" }
    ]);
  };

  return (
    <div className="font-sans w-[90%] text-slate-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Modern React Reconciliation Solutions</h2>
        <div className="flex space-x-2">
          <button 
            className="px-3 py-1 rounded bg-red-500 text-white"
            onClick={resetDemo}
          >
            Reset Demo
          </button>
          <button 
            className={`px-3 py-1 rounded ${isPlaying ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? 'Pause' : 'Play'} Animation
          </button>
          <button 
            className="px-3 py-1 rounded bg-gray-200"
            onClick={() => setAnimationStep(prev => (prev < 5 ? prev + 1 : 0))}
          >
            Step {animationStep}/5
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button 
            className={`px-3 py-1 rounded ${activeDemo === 'stack' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setActiveDemo('stack');
              resetDemo();
            }}
          >
            Fiber Reconciler
          </button>
          <button 
            className={`px-3 py-1 rounded ${activeDemo === 'type' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setActiveDemo('type');
              resetDemo();
            }}
          >
            Component Reuse
          </button>
          <button 
            className={`px-3 py-1 rounded ${activeDemo === 'dom' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setActiveDemo('dom');
              resetDemo();
            }}
          >
            Efficient Updates
          </button>
        </div>
      </div>

      {/* Solution 1: Fiber Reconciler */}
      {activeDemo === 'stack' && (
        <div className="border border-green-300 rounded-lg p-6 bg-green-50 mb-8">
          <h3 className="text-lg font-semibold mb-4">Solution 1: Fiber Reconciler with Concurrent Mode</h3>
          
          <div className="flex bg-white rounded-lg border border-gray-300 p-4 mb-6">
            <div className="w-1/2 border-r border-gray-300 pr-4">
              <h4 className="font-medium mb-2">Main Thread</h4>
              <div className="flex items-center space-x-2 mb-3">
                <div className={`w-4 h-4 rounded-full bg-green-500`}></div>
                <span>{isProcessing ? 'Processing (Non-Blocking)' : 'Running'}</span>
              </div>
              
              <div className="mb-3">
                <div className="mb-1">Counter: {counter}</div>
                <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full bg-green-500 transition-all duration-300`} 
                    style={{width: '100%'}}>
                  </div>
                </div>
                <div className="text-xs mt-1">UI Remains Responsive</div>
              </div>
              
              <button 
                className={`px-3 py-1 rounded ${isPending ? 'bg-blue-400' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                onClick={addItemWithFiber}
                disabled={isProcessing && animationStep < 4}
              >
                {isPending ? 'Processing...' : 'Add Item (Non-Blocking)'}
              </button>
            </div>
            
            <div className="w-1/2 pl-4">
              <h4 className="font-medium mb-2">Fiber Reconciliation Process</h4>
              <div className="rounded-lg border border-gray-300 p-3 bg-gray-50 relative">
                <div className="absolute top-2 right-2">
                  Step: {animationStep}/5
                </div>
                
                {animationStep === 0 && (
                  <div className="flex flex-col space-y-2">
                    <div className="p-2 bg-blue-100 rounded">State Update Triggered</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Begin Fiber Reconciliation</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Process Component Tree</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Commit Phase</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Complete</div>
                  </div>
                )}
                
                {animationStep === 1 && (
                  <div className="flex flex-col space-y-2">
                    <div className="p-2 bg-green-100 rounded">✓ State Update Triggered</div>
                    <div className="p-2 bg-blue-100 rounded">Begin Fiber Reconciliation</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Process Component Tree</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Commit Phase</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Complete</div>
                  </div>
                )}
                
                {animationStep === 2 && (
                  <div className="flex flex-col space-y-2">
                    <div className="p-2 bg-green-100 rounded">✓ State Update Triggered</div>
                    <div className="p-2 bg-green-100 rounded">✓ Begin Fiber Reconciliation</div>
                    <div className="p-2 bg-blue-100 rounded">Process Component Tree (INTERRUPTIBLE)</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Commit Phase</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Complete</div>
                  </div>
                )}
                
                {animationStep === 3 && (
                  <div className="flex flex-col space-y-2">
                    <div className="p-2 bg-green-100 rounded">✓ State Update Triggered</div>
                    <div className="p-2 bg-green-100 rounded">✓ Begin Fiber Reconciliation</div>
                    <div className="p-2 bg-green-100 rounded">✓ Process Component Tree</div>
                    <div className="p-2 bg-blue-100 rounded">Commit Phase (PRIORITIZED)</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Complete</div>
                  </div>
                )}
                
                {animationStep === 4 && (
                  <div className="flex flex-col space-y-2">
                    <div className="p-2 bg-green-100 rounded">✓ State Update Triggered</div>
                    <div className="p-2 bg-green-100 rounded">✓ Begin Fiber Reconciliation</div>
                    <div className="p-2 bg-green-100 rounded">✓ Process Component Tree</div>
                    <div className="p-2 bg-green-100 rounded">✓ Commit Phase</div>
                    <div className="p-2 bg-blue-100 rounded">Complete (UI Updated)</div>
                  </div>
                )}
                
                {animationStep === 5 && (
                  <div className="flex flex-col space-y-2">
                    <div className="p-2 bg-green-100 rounded">✓ State Update Triggered</div>
                    <div className="p-2 bg-green-100 rounded">✓ Begin Fiber Reconciliation</div>
                    <div className="p-2 bg-green-100 rounded">✓ Process Component Tree</div>
                    <div className="p-2 bg-green-100 rounded">✓ Commit Phase</div>
                    <div className="p-2 bg-green-100 rounded">✓ Complete</div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-lg">
                <h5 className="font-medium mb-2">Fiber Reconciler Solutions:</h5>
                <ul className="list-disc pl-5 text-sm">
                  <li>Work is broken into smaller units (fibers)</li>
                  <li>Processing can be interrupted and resumed</li>
                  <li>Updates can be prioritized (high vs. low priority)</li>
                  <li>UI remains responsive during reconciliation</li>
                  <li>Uses requestIdleCallback to yield to browser</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-300 p-4">
            <div className="bg-slate-800 text-white p-3 rounded mb-4 text-sm">
              <code>{`// React 18 Concurrent Mode example
function App() {
  const [isPending, startTransition] = useTransition();
  
  function handleClick() {
    // Mark state update as non-urgent/non-blocking
    startTransition(() => {
      // This won't block the main thread
      setItems([{ id: Date.now(), text: "New Item" }, ...items]);
    });
  }
}`}</code>
            </div>
            
            <h4 className="font-medium mb-2">Component List</h4>
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={item.id} className={`p-2 bg-white border border-gray-300 rounded flex justify-between ${index === 0 && animationStep > 3 ? 'bg-green-50' : ''}`}>
                  <span>{item.text}</span>
                  <span className="text-gray-500">id: {item.id}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Solution 2: Better Component Reuse */}
      {activeDemo === 'type' && (
        <div className="border border-green-300 rounded-lg p-6 bg-green-50 mb-8">
          <h3 className="text-lg font-semibold mb-4">Solution 2: Improved Component Type Handling</h3>
          
          <div className="flex space-x-6">
            <div className="w-1/2">
              <h4 className="font-medium mb-3">Component Structure</h4>
              <div className="bg-white rounded-lg border border-gray-300 p-4 mb-4">
                <div className={`p-3 rounded-lg mb-3 transition-all duration-300 ${containerType === 'span' ? 'bg-yellow-100 border border-yellow-300' : 'bg-blue-100 border border-blue-300'}`}>
                  {containerType === 'span' ? '<span>' : '<div>'}
                </div>
                
                <div className="p-3 rounded-lg border border-green-300 bg-green-100 flex items-center">
                  <div className="flex-1">
                    &lt;Counter /&gt; {containerType === 'span' && <span className="text-green-500 font-bold">✓ State Preserved</span>}
                  </div>
                  <div className="bg-white px-2 py-1 rounded-lg border border-gray-300">
                    Count: {counterValue}
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg mt-3 transition-all duration-300 ${containerType === 'span' ? 'bg-yellow-100 border border-yellow-300' : 'bg-blue-100 border border-blue-300'}`}>
                  {containerType === 'span' ? '</span>' : '</div>'}
                </div>
              </div>
              
              <div className="flex justify-center">
                <button 
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  onClick={toggleContainerType}
                >
                  {containerType === 'div' ? 'Change Container Type' : 'Revert Container Type'}
                </button>
              </div>
            </div>
            
            <div className="w-1/2">
              <h4 className="font-medium mb-3">Reconciliation Process</h4>
              <div className="bg-white rounded-lg border border-gray-300 p-4">
                <div className="relative p-4 border border-gray-200 rounded-lg mb-4 bg-gray-50">
                  <div className="absolute top-2 right-2">
                    Step: {animationStep > 2 ? animationStep - 3 : animationStep}/2
                  </div>
                  
                  {(animationStep === 0 || animationStep === 3) && (
                    <div className="space-y-2">
                      <div className="p-2 bg-blue-100 rounded">Container Type Changed</div>
                      <div className="p-2 bg-gray-200 rounded opacity-50">Check Component Structure</div>
                      <div className="p-2 bg-gray-200 rounded opacity-50">Preserve Internal Components</div>
                    </div>
                  )}
                  
                  {(animationStep === 1 || animationStep === 4) && (
                    <div className="space-y-2">
                      <div className="p-2 bg-green-100 rounded">✓ Container Type Changed</div>
                      <div className="p-2 bg-green-100 rounded">✓ Different Type Detected (div → span)</div>
                      <div className="p-2 bg-gray-200 rounded opacity-50">Preserve Internal Components</div>
                    </div>
                  )}
                  
                  {(animationStep === 2 || animationStep === 5) && (
                    <div className="space-y-2">
                      <div className="p-2 bg-green-100 rounded">✓ Container Type Changed</div>
                      <div className="p-2 bg-green-100 rounded">✓ Different Type Detected</div>
                      <div className="p-2 bg-green-100 rounded">✓ Internal Component State Preserved</div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg bg-green-50">
                  <h5 className="font-medium mb-2">Modern React Solution:</h5>
                  <p className="text-sm mb-2">When container element types change (<code>div</code> → <code>span</code>), React now:</p>
                  <ul className="list-disc pl-5 text-sm">
                    <li>Better tracks component instances in the virtual DOM</li>
                    <li>Preserves internal component state when possible</li>
                    <li>Uses smarter diffing algorithm to minimize DOM operations</li>
                    <li>Counter state persists across container changes</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 bg-slate-800 text-white p-3 rounded text-sm">
                <code>{`// React now preserves components despite parent changes
function App() {
  // The Counter component state persists even when Container changes
  const Container = isSpan ? 'span' : 'div';
  
  return (
    <Container className="container">
      <Counter /> {/* State is preserved! */}
    </Container>
  );
}`}</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Solution 3: Efficient DOM Updates */}
      {activeDemo === 'dom' && (
        <div className="border border-green-300 rounded-lg p-6 bg-green-50">
          <h3 className="text-lg font-semibold mb-4">Solution 3: Optimized DOM Operations</h3>
          
          <div className="flex space-x-6">
            <div className="w-1/2">
              <h4 className="font-medium mb-3">List Rendering With Keys (Improved Algorithm)</h4>
              <div className="bg-white rounded-lg border border-gray-300 p-4">
                <div className="bg-slate-800 text-white p-3 rounded mb-4 text-sm">
                  <code>{`// Modern React with optimized diffing algorithm
<ul>
  {items.map(item => (
    <li key={item.id}>{item.text}</li>
  ))}
</ul>`}</code>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-3 mb-4">
                  <ul className="space-y-2">
                    {listItems.map((item, i) => (
                      <li key={item.id} className={`p-2 border rounded ${i === 0 && animationStep >= 2 ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'}`}>
                        {item.text}
                        {i === 0 && animationStep >= 2 && <span className="ml-2 text-green-500">✓ Only new node created</span>}
                        {animationStep >= 3 && i > 0 && <span className="ml-2 text-green-500">✓ Efficiently reused</span>}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {animationStep >= 2 && (
                  <div className="p-3 bg-green-100 border border-green-300 rounded-lg text-sm">
                    <strong>Solution:</strong> Enhanced diffing algorithm with O(n) complexity
                  </div>
                )}
              </div>
            </div>
            
            <div className="w-1/2">
              <h4 className="font-medium mb-3">Additional Optimizations</h4>
              <div className="bg-white rounded-lg border border-gray-300 p-4">
                <h5 className="font-medium mb-2">Server Components & Streaming SSR</h5>
                <div className="bg-slate-800 text-white p-3 rounded mb-4 text-sm">
                  <code>{`// Server Component (Next.js App Router)
// No client-side JavaScript needed
export default async function ServerList() {
  const items = await fetchItems(); // Server-side only
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}`}</code>
                </div>
                
                <h5 className="font-medium mb-2">Automatic Batching</h5>
                <div className="bg-slate-800 text-white p-3 rounded mb-4 text-sm">
                  <code>{`// Multiple state updates batched automatically
function handleClick() {
  // React 18 batches these into a single render
  setName('Taylor');
  setAge(25);
  setItems([...items, newItem]);
}`}</code>
                </div>
                
                {animationStep >= 2 && (
                  <div className="p-3 bg-green-100 border border-green-300 rounded-lg text-sm">
                    <strong>Modern Enhancements:</strong>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Selective hydration of interactive components</li>
                      <li>Automatic batching of state updates</li>
                      <li>Streaming server rendering</li>
                      <li>Improved memory usage</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <button 
              className={`px-3 py-1 rounded ${animationStep >= 2 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              onClick={addItemToList}
              disabled={animationStep >= 2}
            >
              {animationStep >= 2 ? 'Items Added' : 'Add Item to List'}
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg">
            <h5 className="font-medium mb-2">Beyond Fiber: Modern React Features:</h5>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>Suspense:</strong> Handle loading states declaratively</li>
              <li><strong>Transitions:</strong> Mark updates as non-urgent</li>
              <li><strong>Server Components:</strong> Zero client-side JS for static parts</li>
              <li><strong>Streaming:</strong> Progressive rendering of content</li>
              <li><strong>Automatic Batching:</strong> Multiple state updates in one render</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}