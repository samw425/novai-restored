'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Activity } from 'lucide-react';

interface AudioPlayerProps {
    text: string;
    autoPlay?: boolean;
}

export function AudioPlayer({ text, autoPlay = false }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setIsSupported(true);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            // Try to select a premium-sounding voice if available
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.onend = () => setIsPlaying(false);
            speechRef.current = utterance;

            if (autoPlay) {
                handlePlay();
            }
        }

        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, [text, autoPlay]);

    const handlePlay = () => {
        if (!isSupported || !speechRef.current) return;

        if (isPlaying) {
            window.speechSynthesis.pause();
        } else {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            } else {
                window.speechSynthesis.speak(speechRef.current);
            }
        }
        setIsPlaying(!isPlaying);
    };

    const handleMute = () => {
        if (!speechRef.current) return;
        speechRef.current.volume = isMuted ? 1.0 : 0.0;
        setIsMuted(!isMuted);
    };

    if (!isSupported) return null;

    return (
        <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
            <button
                onClick={handlePlay}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${isPlaying
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
            >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>

            <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    {isPlaying ? 'Playing Brief' : 'Listen to Brief'}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                    AI NARRATION
                </span>
            </div>

            {/* Visual Waveform Animation */}
            <div className="flex items-center gap-0.5 h-8 px-2">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-1 bg-indigo-500 rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : 'h-1 opacity-30'
                            }`}
                        style={{
                            height: isPlaying ? `${Math.random() * 16 + 8}px` : '4px',
                            animationDelay: `${i * 0.1}s`
                        }}
                    />
                ))}
            </div>

            <div className="w-px h-8 bg-gray-200 mx-1" />

            <button
                onClick={handleMute}
                className="text-gray-400 hover:text-gray-600 transition-colors"
            >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
        </div>
    );
}
