import { useState, useEffect, useRef } from 'react';

export default function ReconcilerVisualization() {
  // Animation state
  const [animationStep, setAnimationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeDemo, setActiveDemo] = useState('stack'); // 'stack', 'type', or 'dom'
  
  // Stack reconciler demo state
  const [items, setItems] = useState([
    { id: 1, text: "Item 1" },
    { id: 2, text: "Item 2" },
    { id: 3, text: "Item 3" }
  ]);
  const [counter, setCounter] = useState(0);
  const [isBlocking, setIsBlocking] = useState(false);
  const counterIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Component type demo state
  const [containerType, setContainerType] = useState('div');
  const [counterValue, setCounterValue] = useState(1);
  
  // DOM updates demo state
  const [withoutKeyItems, setWithoutKeyItems] = useState([
    { id: 1, text: "Item 1" },
    { id: 2, text: "Item 2" },
    { id: 3, text: "Item 3" }
  ]);
  const [withKeyItems, setWithKeyItems] = useState([
    { id: 1, text: "Item 1" },
    { id: 2, text: "Item 2" },
    { id: 3, text: "Item 3" }
  ]);
  
  // Counter effect for main thread simulation
  useEffect(() => {
    counterIntervalRef.current = setInterval(() => {
      if (!isBlocking) {
        setCounter(c => c + 1);
      }
    }, 100);
    return () => {
      if (counterIntervalRef.current) {
        clearInterval(counterIntervalRef.current);
      }
    };
  }, [isBlocking]);
  
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
        setIsBlocking(true);
      } else {
        setIsBlocking(false);
      }
    } 
    else if (activeDemo === 'type') {
      // Component type demo sync
      if (animationStep >= 3) {
        setContainerType('span');
        setCounterValue(0); // Reset counter when component type changes
      } else {
        setContainerType('div');
        setCounterValue(animationStep + 1);
      }
    }
    else if (activeDemo === 'dom') {
      // DOM updates demo sync
      if (animationStep >= 2) {
        const newItem = { id: Date.now(), text: "New Item" };
        setWithoutKeyItems([newItem, ...withoutKeyItems]);
        setWithKeyItems([newItem, ...withKeyItems]);
      }
    }
  }, [animationStep, activeDemo]);
  
  // Simulate blocking operation with visible effect
  const addItemWithBlocking = () => {
    // Start blocking UI
    setIsBlocking(true);
    setAnimationStep(2); // Set to blocking step
    
    // Use setTimeout to update UI before blocking
    setTimeout(() => {
      // This will block the main thread
      const start = Date.now();
      while (Date.now() - start < 1000) {
        // Intentionally block the main thread
      }
      
      // Add item after blocking
      setItems(prev => [{ id: Date.now(), text: `New Item ${prev.length + 1}` }, ...prev]);
      
      // Move to step 4 after blocking
      setAnimationStep(4);
      
      // End blocking after a short delay to show the transition
      setTimeout(() => {
        setIsBlocking(false);
        setAnimationStep(5);
      }, 500);
    }, 50);
  };
  
  // Change container type with animation
  const toggleContainerType = () => {
    if (animationStep < 3) {
      setAnimationStep(3);
      setContainerType('span');
      setCounterValue(0);
    } else {
      setAnimationStep(0);
      setContainerType('div');
      setCounterValue(1);
    }
  };
  
  // Add item to list demos
  const addItemToLists = () => {
    setAnimationStep(2);
    const newItem = { id: Date.now(), text: "New Item" };
    setWithoutKeyItems([newItem, ...withoutKeyItems]);
    setWithKeyItems([newItem, ...withKeyItems]);
    
    // Move to step 3 after a short delay
    setTimeout(() => {
      setAnimationStep(3);
    }, 1000);
  };
  
  const resetDemo = () => {
    setAnimationStep(0);
    setIsBlocking(false);
    setItems([
      { id: 1, text: "Item 1" },
      { id: 2, text: "Item 2" },
      { id: 3, text: "Item 3" }
    ]);
    setContainerType('div');
    setCounterValue(1);
    setWithoutKeyItems([
      { id: 1, text: "Item 1" },
      { id: 2, text: "Item 2" },
      { id: 3, text: "Item 3" }
    ]);
    setWithKeyItems([
      { id: 1, text: "Item 1" },
      { id: 2, text: "Item 2" },
      { id: 3, text: "Item 3" }
    ]);
  };

  return (
    <div className="font-sans text-slate-800  w-[90%]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">React Reconciliation Evolution</h2>
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
            Stack Reconciler
          </button>
          <button 
            className={`px-3 py-1 rounded ${activeDemo === 'type' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setActiveDemo('type');
              resetDemo();
            }}
          >
            Component Type
          </button>
          <button 
            className={`px-3 py-1 rounded ${activeDemo === 'dom' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setActiveDemo('dom');
              resetDemo();
            }}
          >
            DOM Updates
          </button>
        </div>
      </div>

      {/* Stack Reconciler Problem */}
      {activeDemo === 'stack' && (
        <div className="border border-red-300 rounded-lg p-6 bg-red-50 mb-8">
          <h3 className="text-lg font-semibold mb-4">Problem 1: Blocking Stack Reconciler</h3>
          
          <div className="flex bg-white rounded-lg border border-gray-300 p-4 mb-6">
            <div className="w-1/2 border-r border-gray-300 pr-4">
              <h4 className="font-medium mb-2">Main Thread</h4>
              <div className="flex items-center space-x-2 mb-3">
                <div className={`w-4 h-4 rounded-full ${isBlocking ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <span>{isBlocking ? 'Blocked' : 'Running'}</span>
              </div>
              
              <div className="mb-3">
                <div className="mb-1">Counter: {counter}</div>
                <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${isBlocking ? 'bg-red-500' : 'bg-green-500'} transition-all duration-300`} 
                    style={{width: `${isBlocking ? '5%' : '100%'}`}}>
                  </div>
                </div>
                <div className="text-xs mt-1">UI Updates {isBlocking ? 'Frozen' : 'Responsive'}</div>
              </div>
              
              <button 
                className={`px-3 py-1 rounded ${isBlocking ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                onClick={addItemWithBlocking}
                disabled={isBlocking}
              >
                {isBlocking ? 'Processing...' : 'Add Item (Blocks UI)'}
              </button>
            </div>
            
            <div className="w-1/2 pl-4">
              <h4 className="font-medium mb-2">Reconciliation Process</h4>
              <div className="rounded-lg border border-gray-300 p-3 bg-gray-50 relative">
                <div className="absolute top-2 right-2">
                  Step: {animationStep}/5
                </div>
                
                {animationStep === 0 && (
                  <div className="flex flex-col space-y-2">
                    <div className="p-2 bg-blue-100 rounded">State Update Triggered</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Begin Reconciliation</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Process Component Tree</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Update DOM</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Return Control</div>
                  </div>
                )}
                
                {animationStep === 1 && (
                  <div className="flex flex-col space-y-2">
                    <div className="p-2 bg-green-100 rounded">✓ State Update Triggered</div>
                    <div className="p-2 bg-blue-100 rounded">Begin Reconciliation</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Process Component Tree</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Update DOM</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Return Control</div>
                  </div>
                )}
                
                {animationStep === 2 && (
                  <div className="flex flex-col space-y-2">
                    <div className="p-2 bg-green-100 rounded">✓ State Update Triggered</div>
                    <div className="p-2 bg-green-100 rounded">✓ Begin Reconciliation</div>
                    <div className="p-2 bg-red-100 rounded">Processing Component Tree (BLOCKING)</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Update DOM</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Return Control</div>
                  </div>
                )}
                
                {animationStep === 3 && (
                  <div className="flex flex-col space-y-2">
                    <div className="p-2 bg-green-100 rounded">✓ State Update Triggered</div>
                    <div className="p-2 bg-green-100 rounded">✓ Begin Reconciliation</div>
                    <div className="p-2 bg-green-100 rounded">✓ Process Component Tree</div>
                    <div className="p-2 bg-red-100 rounded">Updating DOM (BLOCKING)</div>
                    <div className="p-2 bg-gray-200 rounded opacity-50">Return Control</div>
                  </div>
                )}
                
                {animationStep === 4 && (
                  <div className="flex flex-col space-y-2">
                    <div className="p-2 bg-green-100 rounded">✓ State Update Triggered</div>
                    <div className="p-2 bg-green-100 rounded">✓ Begin Reconciliation</div>
                    <div className="p-2 bg-green-100 rounded">✓ Process Component Tree</div>
                    <div className="p-2 bg-green-100 rounded">✓ Update DOM</div>
                    <div className="p-2 bg-blue-100 rounded">Return Control to Main Thread</div>
                  </div>
                )}
                
                {animationStep === 5 && (
                  <div className="flex flex-col space-y-2">
                    <div className="p-2 bg-green-100 rounded">✓ State Update Triggered</div>
                    <div className="p-2 bg-green-100 rounded">✓ Begin Reconciliation</div>
                    <div className="p-2 bg-green-100 rounded">✓ Process Component Tree</div>
                    <div className="p-2 bg-green-100 rounded">✓ Update DOM</div>
                    <div className="p-2 bg-green-100 rounded">✓ Control Returned</div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                <h5 className="font-medium mb-2">Stack Reconciler Problems:</h5>
                <ul className="list-disc pl-5 text-sm">
                  <li>Synchronous processing blocks the main thread</li>
                  <li>No prioritization of work</li>
                  <li>Can't interrupt once started</li>
                  <li>Counter freezes during reconciliation</li>
                  <li>UI becomes unresponsive</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-300 p-4">
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

      {/* Component Type Problem */}
      {activeDemo === 'type' && (
        <div className="border border-red-300 rounded-lg p-6 bg-red-50 mb-8">
          <h3 className="text-lg font-semibold mb-4">Problem 2: Component Type Changes</h3>
          
          <div className="flex space-x-6">
            <div className="w-1/2">
              <h4 className="font-medium mb-3">Component Structure</h4>
              <div className="bg-white rounded-lg border border-gray-300 p-4 mb-4">
                <div className={`p-3 rounded-lg mb-3 transition-all duration-300 ${containerType === 'span' ? 'bg-yellow-100 border border-yellow-300' : 'bg-blue-100 border border-blue-300'}`}>
                  {containerType === 'span' ? '<span>' : '<div>'}
                </div>
                
                <div className="p-3 rounded-lg border border-green-300 bg-green-100 flex items-center">
                  <div className="flex-1">
                    &lt;Counter /&gt; {containerType === 'span' && <span className="text-red-500 font-bold">⚠️ Remounted</span>}
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
                      <div className="p-2 bg-gray-200 rounded opacity-50">Check Component Type</div>
                      <div className="p-2 bg-gray-200 rounded opacity-50">Unmount & Remount</div>
                    </div>
                  )}
                  
                  {(animationStep === 1 || animationStep === 4) && (
                    <div className="space-y-2">
                      <div className="p-2 bg-green-100 rounded">✓ Container Type Changed</div>
                      <div className="p-2 bg-red-100 rounded">Different Type Detected (div → span)</div>
                      <div className="p-2 bg-gray-200 rounded opacity-50">Unmount & Remount</div>
                    </div>
                  )}
                  
                  {(animationStep === 2 || animationStep === 5) && (
                    <div className="space-y-2">
                      <div className="p-2 bg-green-100 rounded">✓ Container Type Changed</div>
                      <div className="p-2 bg-green-100 rounded">✓ Different Type Detected</div>
                      <div className="p-2 bg-red-100 rounded">⚠️ Full Unmount & Remount (State Lost)</div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg bg-yellow-50">
                  <h5 className="font-medium mb-2">Early React Problem:</h5>
                  <p className="text-sm mb-2">When container element types change (<code>div</code> → <code>span</code>), early React would:</p>
                  <ul className="list-disc pl-5 text-sm">
                    <li>Completely unmount the entire subtree</li>
                    <li>Lose all internal component state (counter resets to 0)</li>
                    <li>Remount everything from scratch</li>
                    <li>Cause unnecessary DOM operations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOM Mutation Problem */}
      {activeDemo === 'dom' && (
        <div className="border border-red-300 rounded-lg p-6 bg-red-50">
          <h3 className="text-lg font-semibold mb-4">Problem 3: Inefficient DOM Updates</h3>
          
          <div className="flex space-x-6">
            <div className="w-1/2">
              <h4 className="font-medium mb-3">List Rendering Without Keys</h4>
              <div className="bg-white rounded-lg border border-gray-300 p-4">
                <div className="bg-slate-800 text-white p-3 rounded mb-4 text-sm">
                  <code>{`<ul>
  {items.map(item => (
    <li>{item.text}</li>  // No key prop!
  ))}
</ul>`}</code>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-3 mb-4">
                  <ul className="space-y-2">
                    {withoutKeyItems.map((item, i) => (
                      <li key={item.id} className={`p-2 border rounded ${i === 0 && animationStep >= 2 ? 'bg-red-100 border-red-300' : 'bg-gray-100 border-gray-300'}`}>
                        {item.text}
                        {i === 0 && animationStep >= 2 && <span className="ml-2 text-red-500">⚠️ New</span>}
                        {animationStep >= 3 && i > 0 && <span className="ml-2 text-red-500">⚠️ Rebuilt</span>}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {animationStep >= 2 && (
                  <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-sm">
                    <strong>Problem:</strong> All DOM nodes recreated when adding to the beginning
                  </div>
                )}
              </div>
            </div>
            
            <div className="w-1/2">
              <h4 className="font-medium mb-3">List Rendering With Keys</h4>
              <div className="bg-white rounded-lg border border-gray-300 p-4">
                <div className="bg-slate-800 text-white p-3 rounded mb-4 text-sm">
                  <code>{`<ul>
  {items.map(item => (
    <li key={item.id}>{item.text}</li>  // With key prop!
  ))}
</ul>`}</code>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-3 mb-4">
                  <ul className="space-y-2">
                    {withKeyItems.map((item, i) => (
                      <li key={item.id} className={`p-2 border rounded ${i === 0 && animationStep >= 2 ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'}`}>
                        {item.text}
                        {i === 0 && animationStep >= 2 && <span className="ml-2 text-green-500">✓ Only this node created</span>}
                        {animationStep >= 3 && i > 0 && <span className="ml-2 text-green-500">✓ Reused</span>}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {animationStep >= 2 && (
                  <div className="p-3 bg-green-100 border border-green-300 rounded-lg text-sm">
                    <strong>Solution:</strong> Only new node created, others moved efficiently
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <button 
              className={`px-3 py-1 rounded ${animationStep >= 2 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              onClick={addItemToLists}
              disabled={animationStep >= 2}
            >
              {animationStep >= 2 ? 'Items Added' : 'Add Item to Both Lists'}
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
            <h5 className="font-medium mb-2">Fiber Reconciler Improvements:</h5>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Work can be split into chunks</li>
              <li>Work can be prioritized</li>
              <li>Work can be paused and resumed</li>
              <li>Previous work can be reused or aborted</li>
              <li>More efficient DOM operations</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}