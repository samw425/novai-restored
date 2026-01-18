/**
 * KNOWLEDGE NEBULA (V3 NUCLEAR)
 * High-key Light Mode Visualization
 */

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { NebulaNode, NebulaEdge } from '../lib/types';

// NUCLEAR LIGHT PALETTE
const COLORS = {
    VOID_WHITE: '#ffffff', // Pure White Background
    NODE_BASE: '#e0e5ec',  // Neomorphic Grey
    ACCENT_BLUE: '#3d5afe',
    ACCENT_SLATE: '#4a5568',
    TEXT_DARK: '#2d3748'
};

const CATEGORY_COLORS: Record<string, string> = {
    'COSMIC': '#3d5afe',
    'CONFLICT': '#ff1744',
    'SCIENCE': '#00e676',
    'HISTORICAL': '#651fff'
};

interface NebulaProps {
    nodes: NebulaNode[];
    edges: NebulaEdge[];
    onNodeClick: (node: NebulaNode) => void;
    selectedNode: NebulaNode | null;
}

// ═══════════════════════════════════════════════════════════════
function BreathingNode({ node, onClick, isSelected }: { node: NebulaNode; onClick: () => void; isSelected: boolean }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const color = CATEGORY_COLORS[node.category] || COLORS.ACCENT_SLATE;

    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.getElapsedTime();
            // Subtle breathing
            const scale = 1 + Math.sin(time * 2 + node.x) * 0.1;
            meshRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group position={[node.x, node.y, node.z]}>
            <mesh ref={meshRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial
                    color={isSelected ? COLORS.ACCENT_BLUE : COLORS.NODE_BASE}
                    emissive={color}
                    emissiveIntensity={isSelected ? 0.8 : 0.2}
                    roughness={0.2}
                    metalness={0.1}
                />
            </mesh>
            {/* HTML LABEL (Neomorphic) */}
            {(isSelected || node.intensity > 0.8) && (
                <Html distanceFactor={12}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        boxShadow: '4px 4px 10px rgba(0,0,0,0.1)',
                        border: `1px solid ${color}`,
                        color: COLORS.TEXT_DARK,
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none'
                    }}>
                        {node.title}
                    </div>
                </Html>
            )}
        </group>
    );
}

function RhymeEdge({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
    const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);

    // Convert points to Float32Array for BufferAttribute
    const positions = useMemo(() => {
        const arr = new Float32Array(points.length * 3);
        points.forEach((p, i) => {
            arr[i * 3] = p.x;
            arr[i * 3 + 1] = p.y;
            arr[i * 3 + 2] = p.z;
        });
        return arr;
    }, [points]);

    return (
        <line>
            <bufferGeometry>
                {/* @ts-expect-error: Three Fiber types mismatch for bufferAttribute args */}
                <bufferAttribute
                    attach="attributes-position"
                    count={points.length}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color={COLORS.ACCENT_SLATE} opacity={0.15} transparent linewidth={1} />
        </line>
    );
}

// ═══════════════════════════════════════════════════════════════
function CinematicCamera({ selectedNode }: { selectedNode: NebulaNode | null }) {
    const { camera } = useThree();
    const vec = new THREE.Vector3();

    useFrame(() => {
        if (selectedNode) {
            // Zoom to node
            const targetPos = new THREE.Vector3(selectedNode.x, selectedNode.y, selectedNode.z);
            camera.position.lerp(vec.set(targetPos.x + 2, targetPos.y + 2, targetPos.z + 5), 0.05);
            camera.lookAt(targetPos);
        }
    });

    return null;
}

// ═══════════════════════════════════════════════════════════════
// FIBONACCI SPHERE ALGORITHM (For beautiful distribution)
function generateLayout(rawNodes: any[]): NebulaNode[] {
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    return rawNodes.map((node, i) => {
        const y = 1 - (i / (rawNodes.length - 1)) * 2; // y goes from 1 to -1
        const radius = Math.sqrt(1 - y * y); // Radius at y

        const theta = phi * i; // Golden angle increment

        const r = 10 + Math.random() * 5; // Base radius variation

        const x = Math.cos(theta) * radius * r;
        const z = Math.sin(theta) * radius * r;
        const yPos = y * r;

        return {
            ...node,
            id: node.id || node.event_id,
            intensity: node.intensity || node.intensity_score || 0.5,
            x,
            y: yPos,
            z
        };
    });
}

export function KnowledgeNebula({ nodes, edges, onNodeClick, selectedNode }: NebulaProps) {
    // Generate 3D layout since API only returns data
    const layoutNodes = useMemo(() => generateLayout(nodes), [nodes]);

    const nodePositions = useMemo(() => {
        const map = new Map<string, [number, number, number]>();
        layoutNodes.forEach(n => map.set(n.id, [n.x, n.y, n.z]));
        return map;
    }, [layoutNodes]);

    return (
        <Canvas
            camera={{ position: [0, 0, 15], fov: 60 }}
            style={{ background: 'transparent' }} // Let parent bg show through
            gl={{ antialias: true, alpha: true }}
            shadows
        >
            {/* HIGH KEY LIGHTING */}
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={2.0} color="#fff" />
            <spotLight position={[-10, 20, 10]} angle={0.3} penumbra={1} intensity={2} color={COLORS.ACCENT_BLUE} />

            <CinematicCamera selectedNode={selectedNode} />
            <OrbitControls autoRotate={!selectedNode} autoRotateSpeed={0.5} enableDamping />

            {edges.map((edge, i) => {
                const s = nodePositions.get(edge.source);
                const e = nodePositions.get(edge.target);
                if (!s || !e) return null;
                return <RhymeEdge key={i} start={s} end={e} />;
            })}

            {layoutNodes.map((node) => (
                <BreathingNode
                    key={node.id}
                    node={node}
                    onClick={() => onNodeClick(node)}
                    isSelected={selectedNode?.id === node.id}
                />
            ))}
        </Canvas>
    );
}
