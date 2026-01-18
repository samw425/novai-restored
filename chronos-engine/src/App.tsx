/**
 * THE CHRONOS ENGINE
 * 
 * Main Application - Discovering the purpose of existence and humanity
 * through the interconnected patterns of cosmic, human, and historical events.
 */

import { useState, useEffect, useCallback } from 'react';
import { KnowledgeNebula } from './components/Nebula';
import { Dashboard } from './components/Dashboard';
import { DeepWork } from './components/DeepWork';
import './App.css';
import type { NebulaNode, NebulaEdge, GlobalState, DailyRhyme } from './lib/types';

// SEO JSON-LD
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "The Chronos Engine",
  "description": "A real-time cosmic intelligence platform correlating solar activity, global news, and scientific breakthroughs with historical patterns.",
  "url": "https://chronos-engine.pages.dev",
  "keywords": "Cosmic Intelligence, Solar Flares, GDELT, History Rhymes, Knowledge Nebula",
  "creator": {
    "@type": "Organization",
    "name": "Chronos Labs"
  }
};

interface NebulaData {
  nodes: NebulaNode[];
  edges: NebulaEdge[];
  state: GlobalState;
  dailyRhyme?: DailyRhyme;
}

// ═══════════════════════════════════════════════════════════════
// MOCK DATA GENERATOR
// ═══════════════════════════════════════════════════════════════
const getMockTitle = (category: string, index: number): string => {
  const titles: Record<string, string[]> = {
    COSMIC: ['M-Class Solar Flare Detected', 'CME Impact on Magnetosphere', 'Solar Wind Intensification', 'Geomagnetic Storm Warning'],
    CONFLICT: ['Trade Tensions Escalate', 'Diplomatic Summit Announced', 'Regional Stability Concerns', 'Peace Negotiations Begin'],
    SCIENCE: ['Quantum Computing Breakthrough', 'New Element Synthesized', 'Climate Model Refined', 'Consciousness Research Published'],
    HISTORICAL: ['Rise of the Roman Empire', 'The Renaissance Begins', 'Industrial Revolution', 'Age of Enlightenment'],
  };
  const list = titles[category] || titles.SCIENCE;
  return list[index % list.length];
};

const getMockSynthesis = (category: string): string => {
  const syntheses: Record<string, string> = {
    COSMIC: 'The sun speaks in waves of electromagnetic fire, reminding us that even stars have moods that ripple across the cosmic ocean.',
    CONFLICT: 'Human ambition collides with collective fear, creating friction that has echoes through every civilization.',
    SCIENCE: 'At the frontier of knowledge, researchers peer into mysteries that ancient philosophers could only dream of.',
    HISTORICAL: 'In the annals of time, this moment stands as a pivot point where the trajectory of human consciousness shifted.',
  };
  return syntheses[category] || syntheses.SCIENCE;
};

const generateMockData = (): NebulaData => {
  const categories: Array<'COSMIC' | 'CONFLICT' | 'SCIENCE' | 'HISTORICAL'> = ['COSMIC', 'CONFLICT', 'SCIENCE', 'HISTORICAL'];
  const nodes: NebulaNode[] = [];

  for (let i = 0; i < 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const angle = (i / 50) * Math.PI * 2;
    const r = 10 + Math.random() * 5;
    nodes.push({
      id: `node-${i}`,
      event_id: `node-${i}`,
      title: getMockTitle(category, i),
      category,
      intensity: 0.3 + Math.random() * 0.7,
      intensity_score: 0.3 + Math.random() * 0.7,
      timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      synthesis: getMockSynthesis(category),
      x: Math.cos(angle) * r,
      y: (Math.random() - 0.5) * 8,
      z: Math.sin(angle) * r,
      source_type: 'NASA',
      content_blob: 'Mock content',
      raw_data: '{}'
    });
  }

  return {
    nodes,
    edges: [],
    state: { cosmic_turbulence: 0.5, human_sentiment: 0.5, existential_alignment: 0.5 },
    dailyRhyme: {
      modern: "Rising tensions in global trade",
      historical: "The Silk Road disputes of 1279",
      explanation: "History echoes through economic friction."
    }
  };
};

// ═══════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════
function App() {
  const [data, setData] = useState<NebulaData | null>(null);
  const [selectedNode, setSelectedNode] = useState<NebulaNode | null>(null);
  const [isDeepWork, setIsDeepWork] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/nebula');
      if (response.ok) {
        const nebulaData = await response.json();
        setData(nebulaData as NebulaData);
      } else {
        throw new Error('Offline');
      }
    } catch {
      console.log('[CHRONOS] Using fallback stream');
      setData(generateMockData());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(JSON_LD);
    document.head.appendChild(script);

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => {
      clearInterval(interval);
      document.head.removeChild(script);
    };
  }, [fetchData]);

  const handleNodeClick = useCallback((node: NebulaNode) => {
    setSelectedNode(prev => prev?.id === node.id ? null : node);
  }, []);

  const handleOverviewClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleDeepWorkClick = useCallback(() => {
    setIsDeepWork(prev => !prev);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p className="loading-text">Connecting to the cosmic stream...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={`app ${isDeepWork ? 'deep-work-mode' : ''}`} style={{ backgroundColor: '#fcfcfc', color: '#1a1a1a' }}>
      <main className="nebula-container">
        <KnowledgeNebula
          nodes={data.nodes as any} // Forced cast to resolve strict type mismatch
          edges={data.edges}
          onNodeClick={handleNodeClick}
          selectedNode={selectedNode}
        />
      </main>

      <Dashboard
        state={data.state}
        dailyRhyme={data.dailyRhyme}
        onOverviewClick={handleOverviewClick}
        onDeepWorkClick={handleDeepWorkClick}
      />

      {isDeepWork && (
        <DeepWork
          nodes={data.nodes as any}
          onClose={handleDeepWorkClick}
        />
      )}

      {selectedNode && (
        <div className="node-detail-panel">
          <button className="close-btn" onClick={() => setSelectedNode(null)}>×</button>
          <div className="detail-category" style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--accent-blue)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '16px'
          }}>
            {selectedNode.category}
          </div>
          <h2 className="detail-title">{selectedNode.title}</h2>
          <div className="detail-meta" style={{
            display: 'flex',
            gap: '16px',
            fontSize: '0.9rem',
            color: 'var(--text-dim)',
            marginBottom: '24px',
            fontWeight: 500
          }}>
            <span>Intensity: {Math.round(selectedNode.intensity * 100)}%</span>
            <span>{new Date(selectedNode.timestamp).toLocaleDateString()}</span>
          </div>
          <p className="detail-synthesis">{selectedNode.synthesis}</p>
        </div>
      )}
    </div>
  );
}

export default App;
