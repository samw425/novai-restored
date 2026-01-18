/**
 * THE DEEP WORK MODE
 * 
 * A distraction-free, manuscript-style layout for researchers and writers.
 * Focuses on the raw synthesis of history and the cosmic pulse.
 */

import React from 'react';

interface NebulaNode {
    id: string;
    title: string;
    category: 'COSMIC' | 'CONFLICT' | 'SCIENCE' | 'HISTORICAL';
    intensity: number;
    timestamp: number;
    synthesis: string;
}

interface DeepWorkProps {
    nodes: NebulaNode[];
    onClose: () => void;
}

export const DeepWork: React.FC<DeepWorkProps> = ({ nodes, onClose }) => {
    // Group nodes by category
    const groupedNodes = nodes.reduce((acc, node) => {
        if (!acc[node.category]) acc[node.category] = [];
        acc[node.category].push(node);
        return acc;
    }, {} as Record<string, NebulaNode[]>);

    return (
        <div className="deep-work-overlay">
            <div className="deep-work-content">
                <header className="deep-work-header">
                    <h1 className="manuscript-title">The Chronicle of Existence</h1>
                    <button className="exit-btn" onClick={onClose}>Return to Nebula</button>
                    <p className="manuscript-subtitle">Synthesized records from the modern and historical pulse</p>
                </header>

                <div className="manuscript-body">
                    {Object.entries(groupedNodes).map(([category, categoryNodes]) => (
                        <section key={category} className="manuscript-section">
                            <h2 className="section-heading">{category} Records</h2>
                            <div className="entries-list">
                                {categoryNodes.map(node => (
                                    <article key={node.id} className="manuscript-entry">
                                        <div className="entry-meta">
                                            <span className="entry-date">{new Date(node.timestamp).toLocaleDateString()}</span>
                                            <span className="entry-intensity">Intensity: {Math.round(node.intensity * 100)}%</span>
                                        </div>
                                        <h3 className="entry-title">{node.title}</h3>
                                        <div className="entry-content">
                                            {node.synthesis}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <footer className="deep-work-footer">
                    <p>&copy; The Chronos Engine | Decoded Daily</p>
                </footer>
            </div>
        </div>
    );
};

export default DeepWork;
