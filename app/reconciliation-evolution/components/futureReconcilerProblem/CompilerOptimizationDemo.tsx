'use client';

import { useState, useEffect } from 'react';

export default function CompilerOptimizationDemo({ 
  animationStep, 
  isPlaying 
}: { 
  animationStep: number;
  isPlaying: boolean;
}) {
  // Demo state for compiler optimization example
  const [isOpen, setIsOpen] = useState(false);
  const [sveltCounter, setSvelteCounter] = useState(0);
  const [reactCompilerCounter, setReactCompilerCounter] = useState(0);
  const [showCompilerVisual, setShowCompilerVisual] = useState(false);
  
  // Animate demo based on animation step
  useEffect(() => {
    // Compiler optimization animation
    if (animationStep === 1) {
      setSvelteCounter(prev => prev + 1);
      setShowCompilerVisual(true);
    } else if (animationStep === 2) {
      setReactCompilerCounter(prev => prev + 1);
    } else if (animationStep === 3) {
      setShowCompilerVisual(false);
    }
  }, [animationStep]);
  
  const resetDemo = () => {
    setSvelteCounter(0);
    setReactCompilerCounter(0);
    setShowCompilerVisual(false);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isPlaying) {
      resetDemo();
    }
  }, [isPlaying]);

  return (
    <div className="p-6 bg-yellow-50 rounded-lg text-black border border-yellow-200">
      <h3 className="text-xl font-medium mb-3">Challenge 3: Compiler Optimization</h3>
      <p className="mb-4">React relies more on runtime than compile-time optimizations:</p>
      
      <div className="flex space-x-4 mb-6">
        <div className="w-1/2 p-4 border border-gray-300 rounded-lg bg-white">
          <h4 className="font-medium mb-3">Svelte's Compile-Time Approach</h4>
          
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-3 relative">
            <div className="flex justify-between items-center">
              <div>
                Count: <span className={`font-bold ${animationStep === 1 ? 'animate-pulse bg-green-200 px-1 rounded' : ''}`}>{sveltCounter}</span>
              </div>
              <button 
                className="px-2 py-1 bg-green-500 text-white text-sm rounded"
                onClick={() => setSvelteCounter(sveltCounter + 1)}
              >
                Increment
              </button>
            </div>
          </div>
          
          <div className="flex mb-3">
            <div className="w-1/2 pr-1">
              <div className="bg-slate-800  p-2 rounded-md text-xs h-full">
                <pre>
                  <code>{`<!-- Svelte -->
<script>
  let count = 0;
</script>

<button on:click={() => count++}>
  Count: {count}
</button>`}</code>
                </pre>
              </div>
            </div>
            <div className="w-1/2 pl-1">
              <div className="bg-slate-800  p-2 rounded-md text-xs h-full">
                <pre>
                  <code>{`// Compiled output
function create_fragment(ctx) {
  let button;
  let t0;
  let t1;
  let mounted;
  
  return {
    c() {
      button = element("button");
      t0 = text("Count: ");
      t1 = text(ctx[0]);
    },
    m(target, anchor) {
      // Optimal DOM code
    },
    p(ctx, [dirty]) {
      if (dirty & 1) 
        set_data(t1, ctx[0]);
    }
  };
}`}</code>
                </pre>
              </div>
            </div>
          </div>
          
          {showCompilerVisual && (
            <div className="p-3 bg-green-100 border border-green-300 rounded-lg text-sm mb-3">
              <div className="font-medium mb-1">Compilation Process:</div>
              <div className="flex items-center">
                <div className="px-3 py-1 bg-green-200 rounded">Template</div>
                <div className="px-2">→</div>
                <div className="px-3 py-1 bg-green-200 rounded">Analyze</div>
                <div className="px-2">→</div>
                <div className="px-3 py-1 bg-green-200 rounded">Optimize</div>
                <div className="px-2">→</div>
                <div className="px-3 py-1 bg-green-200 rounded">Generate JS</div>
              </div>
            </div>
          )}
          
          <div className="p-3 bg-green-100 border border-green-300 rounded-lg text-sm">
            <p><strong>Advantage:</strong> Compiles to optimal JavaScript that directly manipulates exactly what needs to change.</p>
          </div>
        </div>
        
        <div className="w-1/2 p-4 border border-gray-300 rounded-lg bg-white">
          <h4 className="font-medium mb-3">React's Runtime Approach</h4>
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3 relative">
            <div className="flex justify-between items-center">
              <div>
                Count: <span className={`font-bold ${animationStep === 2 ? 'animate-pulse bg-blue-200 px-1 rounded' : ''}`}>{reactCompilerCounter}</span>
              </div>
              <button 
                className="px-2 py-1 bg-blue-500 text-white text-sm rounded"
                onClick={() => setReactCompilerCounter(reactCompilerCounter + 1)}
              >
                Increment
              </button>
            </div>
          </div>
          
          <div className="flex mb-3">
            <div className="w-1/2 pr-1">
              <div className="bg-slate-800  p-2 rounded-md text-xs h-full">
                <pre>
                  <code>{`// React
function Counter() {
  const [count, setCount] = 
    useState(0);
  
  return (
    <button onClick={() => 
      setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`}</code>
                </pre>
              </div>
            </div>
            <div className="w-1/2 pl-1">
              <div className="bg-slate-800  p-2 rounded-md text-xs h-full">
                <pre>
                  <code>{`// React runtime reconciliation
// Creates virtual DOM
const element = {
  type: 'button',
  props: {
    onClick: () => setCount(count + 1),
    children: ['Count: ', count]
  }
};

// Reconciles with previous render
// Finds differences and updates DOM
// More runtime overhead`}</code>
                </pre>
              </div>
            </div>
          </div>
          
          {showCompilerVisual && (
            <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-sm mb-3">
              <div className="font-medium mb-1">Runtime Process:</div>
              <div className="flex items-center">
                <div className="px-3 py-1 bg-yellow-200 rounded">JSX</div>
                <div className="px-2">→</div>
                <div className="px-3 py-1 bg-yellow-200 rounded">createElement</div>
                <div className="px-2">→</div>
                <div className="px-3 py-1 bg-yellow-200 rounded">Diff</div>
                <div className="px-2">→</div>
                <div className="px-3 py-1 bg-yellow-200 rounded">Update DOM</div>
              </div>
            </div>
          )}
          
          <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-sm">
            <p><strong>Challenge:</strong> Runtime reconciliation introduces overhead. React Compiler (experimental) aims to bring compile-time optimizations.</p>
          </div>
        </div>
      </div>
      
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        Toggle Advanced Example
      </button>
      
      {isOpen && (
        <div className="bg-white p-4 rounded-lg border border-gray-300">
          <h4 className="font-medium mb-2">Deep Dive: Compiler Optimizations</h4>
          <div className="flex space-x-4">
            <div className="w-1/2 p-3 border border-green-200 rounded-lg bg-green-50">
              <div className="font-medium mb-2">Svelte's Approach</div>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Static analysis at build time</li>
                <li>Converts templates to highly optimized vanilla JS</li>
                <li>No virtual DOM overhead</li>
                <li>No diffing algorithm at runtime</li>
                <li>Smaller bundle size</li>
              </ul>
            </div>
            <div className="w-1/2 p-3 border border-blue-200 rounded-lg bg-blue-50">
              <div className="font-medium mb-2">React Compiler (Experimental)</div>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Working on compile-time optimizations</li>
                <li>Automatic memoization</li>
                <li>Automates component splitting</li>
                <li>Eliminates reconciliation when possible</li>
                <li>Preserves React programming model</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}