// app/reconciliation-evolution/page.tsx
'use client';

import { useState } from 'react';
import ReconciliationDemo from './components/ReconciliationDemo';
import LegacyReconcilerDemo from './components/LegacyReconcilerDemo';
import ModernReconcilerDemo from './components/ModernReconcilerDemo';
import FutureReconcilerDemo from './components/FutureReconcilerDemo';

export  function ReconciliationEvolutionPage() {
  const [activeTab, setActiveTab] = useState<'legacy' | 'modern' | 'future'>('legacy');
  
  return (
    <div className=" p-10 ">
      <h1 className="text-3xl font-bold mb-6">Evolution of React Reconciliation</h1>
      
      <div className="mb-8">
        <div className="flex gap-2 mb-4">
          <button 
            className={`px-4 py-2 ${activeTab === 'legacy' ? 'bg-black text-white' : 'text-black border'}`}
            onClick={() => setActiveTab('legacy')}
          >
            Early Problems
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'modern' ? 'bg-black text-white' : 'text-black border'}`}
            onClick={() => setActiveTab('modern')}
          >
            Modern Solutions
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'future' ? 'bg-black text-white' : 'text-black border'}`}
            onClick={() => setActiveTab('future')}
          >
            Remaining Challenges
          </button>
        </div>
        
        {activeTab === 'legacy' && <LegacyReconcilerDemo />}
        {activeTab === 'modern' && <ModernReconcilerDemo />}
        {activeTab === 'future' && <FutureReconcilerDemo />}
      </div>
    </div>
  );
}