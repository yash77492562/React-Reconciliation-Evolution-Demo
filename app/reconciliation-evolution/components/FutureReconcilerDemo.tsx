// app/reconciliation-evolution/components/FutureReconcilerDemo.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import FineGrainedDemo from './futureReconcilerProblem/fineGrainedDemo';
import PartialHydrationDemo from './futureReconcilerProblem/partialHydrationDemo';
import CompilerOptimizationDemo from './futureReconcilerProblem/CompilerOptimizationDemo';

export default function FutureReconcilerDemo() {
  // Animation controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Demo selection state
  type DemoType = 'fine-grained' | 'hydration' | 'compiler';
  const demoOptions: ReadonlyArray<DemoType> = ['fine-grained', 'hydration', 'compiler'];
  const [selectedDemo, setSelectedDemo] = useState<DemoType>('fine-grained');
  
  // Maximum animation steps for each demo
  const maxSteps = {
    'fine-grained': 2,
    'hydration': 3,
    'compiler': 3
  };
  
  // Control animation playback
  const startAnimation = () => {
    if (animationIntervalRef.current) return;
    
    setIsPlaying(true);
    setAnimationStep(0);
    
    animationIntervalRef.current = setInterval(() => {
      setAnimationStep(prevStep => {
        const nextStep = prevStep + 1;
        if (nextStep > maxSteps[selectedDemo]) {
          stopAnimation();
          return 0;
        }
        return nextStep;
      });
    }, 2000); // Advance animation every 2 seconds
  };
  
  const stopAnimation = () => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
    setIsPlaying(false);
    setAnimationStep(0);
  };
  
  const resetAnimation = () => {
    stopAnimation();
    setAnimationStep(0);
  };
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, []);
  
  // Reset animation when changing demos
  useEffect(() => {
    resetAnimation();
  }, [selectedDemo]);
  
  return (
    <div className=" w-[90%] mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">React Reconciliation Evolution</h2>
      
      {/* Demo selection */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          {demoOptions.map((demo) => (
            <button
              key={demo}
              type="button"
              onClick={() => setSelectedDemo(demo)}
              className={`px-4 py-2 text-sm font-medium border ${
                selectedDemo === demo 
                  ? 'bg-blue-500 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } ${
                demo === 'fine-grained' 
                  ? 'rounded-l-lg' 
                  : demo === 'compiler' 
                    ? 'rounded-r-lg' 
                    : ''
              }`}
            >
              {demo === 'fine-grained' && 'Fine-Grained Reactivity'}
              {demo === 'hydration' && 'Partial Hydration'}
              {demo === 'compiler' && 'Compiler Optimization'}
            </button>
          ))}
        </div>
      </div>
      
      {/* Animation controls */}
      <div className="mb-8 flex justify-center space-x-4">
        <button
          onClick={startAnimation}
          disabled={isPlaying}
          className={`px-4 py-2 rounded-md ${
            isPlaying ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          Start Animation
        </button>
        <button
          onClick={stopAnimation}
          disabled={!isPlaying}
          className={`px-4 py-2 rounded-md ${
            !isPlaying ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          Stop Animation
        </button>
        <button
          onClick={() => setAnimationStep(prev => (prev + 1) % (maxSteps[selectedDemo] + 1))}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          Next Step
        </button>
      </div>
      
      {/* Animation progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-gray-700">Progress:</span>
          <span className="text-xs font-medium text-gray-700">
            Step {animationStep} of {maxSteps[selectedDemo]}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ 
              width: `${(animationStep / maxSteps[selectedDemo]) * 100}%`
            }}
          ></div>
        </div>
      </div>
      
      {/* Demo content */}
      <div className="demo-content">
        {selectedDemo === 'fine-grained' && (
          <FineGrainedDemo animationStep={animationStep} isPlaying={isPlaying} />
        )}
        
        {selectedDemo === 'hydration' && (
          <PartialHydrationDemo animationStep={animationStep} isPlaying={isPlaying} />
        )}
        
        {selectedDemo === 'compiler' && (
          <CompilerOptimizationDemo animationStep={animationStep} isPlaying={isPlaying} />
        )}
      </div>
      
      {/* Learning resources */}
      <div className="mt-8 p-4 bg-blue-50 text-black rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium mb-2">Learn More</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>
            <a 
              href="https://react.dev/blog/2022/03/29/react-v18" 
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              React 18 Release Notes
            </a>
          </li>
          <li>
            <a 
              href="https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023" 
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Labs: What We've Been Working On
            </a>
          </li>
          <li>
            <a 
              href="https://www.solidjs.com/" 
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SolidJS Documentation
            </a>
          </li>
          <li>
            <a 
              href="https://astro.build/" 
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Astro Islands Architecture
            </a>
          </li>
          <li>
            <a 
              href="https://qwik.builder.io/" 
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Qwik Framework
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}