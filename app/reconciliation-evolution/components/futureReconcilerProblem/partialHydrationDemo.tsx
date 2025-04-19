'use client';

import { useState, useEffect } from 'react';

export default function PartialHydrationDemo({ 
  animationStep, 
  isPlaying 
}: { 
  animationStep: number;
  isPlaying: boolean;
}) {
  // Demo state for partial hydration example
  const [isHydrated, setIsHydrated] = useState({
    header: false,
    hero: false,
    content: false,
    footer: false
  });
  
  // Animate demo based on animation step
  useEffect(() => {
    // Partial hydration animation
    if (animationStep === 0) {
      setIsHydrated({
        header: false,
        hero: false,
        content: false,
        footer: false
      });
    } else if (animationStep === 1) {
      setIsHydrated(prev => ({ ...prev, hero: true }));
    } else if (animationStep === 2) {
      setIsHydrated(prev => ({ ...prev, footer: true }));
    } else if (animationStep === 3) {
      // React's approach - hydrate everything
      setIsHydrated({
        header: true,
        hero: true,
        content: true,
        footer: true
      });
    }
  }, [animationStep]);
  
  const resetDemo = () => {
    setIsHydrated({
      header: false,
      hero: false,
      content: false,
      footer: false
    });
  };

  useEffect(() => {
    if (!isPlaying) {
      resetDemo();
    }
  }, [isPlaying]);

  return (
    <div className="mb-6 p-6 bg-yellow-50 rounded-lg text-black border border-yellow-200">
      <h3 className="text-xl font-medium mb-3">Challenge 2: Partial Hydration</h3>
      <p className="mb-4">Despite improvements, React's hydration model still has overhead compared to islands architecture:</p>
      
      <div className="flex space-x-4 mb-6">
        <div className="w-1/2 p-4 border border-gray-300 rounded-lg bg-white">
          <h4 className="font-medium mb-3">Astro/Qwik Islands Architecture</h4>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className={`p-3 ${isHydrated.header ? 'bg-gray-100' : 'bg-gray-50'} border-b border-gray-200`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">Static Header</span>
                <span className="px-2 py-1 text-xs rounded bg-gray-200">No JS</span>
              </div>
            </div>
            
            <div className={`p-3 ${isHydrated.hero ? 'bg-green-50 animate-pulse' : 'bg-gray-50'} border-b border-gray-200`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">Interactive Hero</span>
                <span className={`px-2 py-1 text-xs rounded ${isHydrated.hero ? 'bg-green-500 text-white' : 'bg-yellow-200'}`}>
                  {isHydrated.hero ? 'Hydrated' : 'client:load'}
                </span>
              </div>
            </div>
            
            <div className={`p-3 ${isHydrated.content ? 'bg-gray-100' : 'bg-gray-50'} border-b border-gray-200`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">Static Content</span>
                <span className="px-2 py-1 text-xs rounded bg-gray-200">No JS</span>
              </div>
            </div>
            
            <div className={`p-3 ${isHydrated.footer ? 'bg-green-50 animate-pulse' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">Interactive Footer</span>
                <span className={`px-2 py-1 text-xs rounded ${isHydrated.footer ? 'bg-green-500 text-white' : 'bg-yellow-200'}`}>
                  {isHydrated.footer ? 'Hydrated' : 'client:visible'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-3 bg-slate-800  p-3 rounded-md mb-3 text-xs">
            <pre>
              <code>{`<!-- Astro/Qwik islands architecture -->
<Layout>
  <StaticHeader /> <!-- No JS -->
  <InteractiveHero client:load /> <!-- Immediate -->
  <StaticContent /> <!-- No JS -->
  <InteractiveFooter client:visible /> <!-- When visible -->
</Layout>`}</code>
            </pre>
          </div>
          
          <div className="p-3 bg-green-100 border border-green-300 rounded-lg text-sm">
            <p><strong>Advantage:</strong> Only hydrates interactive components, dramatically reducing JavaScript payload and execution time.</p>
          </div>
        </div>
        
        <div className="w-1/2 p-4 border border-gray-300 rounded-lg bg-white">
          <h4 className="font-medium mb-3">React Server Components Approach</h4>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className={`p-3 ${animationStep >= 3 ? 'bg-blue-50' : 'bg-gray-50'} border-b border-gray-200`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">Header (Server Component)</span>
                <span className={`px-2 py-1 text-xs rounded ${animationStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  {animationStep >= 3 ? 'Hydrated' : 'No Client JS'}
                </span>
              </div>
            </div>
            
            <div className={`p-3 ${animationStep >= 3 ? 'bg-blue-50' : 'bg-gray-50'} border-b border-gray-200`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">Hero (Client Component)</span>
                <span className={`px-2 py-1 text-xs rounded ${animationStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  {animationStep >= 3 ? 'Hydrated' : 'use client'}
                </span>
              </div>
            </div>
            
            <div className={`p-3 ${animationStep >= 3 ? 'bg-blue-50' : 'bg-gray-50'} border-b border-gray-200`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">Content (Server Component)</span>
                <span className={`px-2 py-1 text-xs rounded ${animationStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  {animationStep >= 3 ? 'Hydrated' : 'No Client JS'}
                </span>
              </div>
            </div>
            
            <div className={`p-3 ${animationStep >= 3 ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">Footer (Client Component)</span>
                <span className={`px-2 py-1 text-xs rounded ${animationStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  {animationStep >= 3 ? 'Hydrated' : 'use client'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-3 bg-slate-800 text-black p-3 rounded-md mb-3 text-xs">
            <pre>
              <code>{`// React Server Components
// Header.js (Server Component)
export default function Header() {
  return <header>...</header>;
}

// Hero.js
'use client'; // Client Component
export default function Hero() {
  return <section>...</section>;
}`}</code>
            </pre>
          </div>
          
          <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-sm">
            <p><strong>Challenge:</strong> While Server Components help, React still hydrates all client components at once, rather than truly on-demand.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-300">
        <h4 className="font-medium mb-2">Hydration Performance Metrics</h4>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">JS Bundle Size</span>
              <span className="text-sm">{animationStep >= 3 ? '130KB' : isHydrated.hero && isHydrated.footer ? '50KB' : isHydrated.hero ? '30KB' : '0KB'}</span>
            </div>
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`absolute inset-y-0 left-0 transition-all duration-500 ${animationStep >= 3 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ 
                  width: animationStep >= 3 ? '70%' : 
                         isHydrated.hero && isHydrated.footer ? '35%' : 
                         isHydrated.hero ? '20%' : '0%' 
                }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Hydration Time</span>
              <span className="text-sm">{animationStep >= 3 ? '540ms' : isHydrated.hero && isHydrated.footer ? '180ms' : isHydrated.hero ? '90ms' : '0ms'}</span>
            </div>
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`absolute inset-y-0 left-0 transition-all duration-500 ${animationStep >= 3 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ 
                  width: animationStep >= 3 ? '65%' : 
                         isHydrated.hero && isHydrated.footer ? '25%' : 
                         isHydrated.hero ? '10%' : '0%' 
                }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Interaction Readiness</span>
              <span className="text-sm">{animationStep >= 3 ? 'All at once (delayed)' : 'Progressive'}</span>
            </div>
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`absolute inset-y-0 left-0 transition-all duration-500 ${animationStep >= 3 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ 
                  width: animationStep >= 3 ? '60%' : 
                         isHydrated.hero && isHydrated.footer ? '90%' : 
                         isHydrated.hero ? '40%' : '0%' 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}