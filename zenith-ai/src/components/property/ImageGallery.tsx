'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import Image from 'next/image';

interface ImageGalleryProps {
    images: string[];
    address: string;
}

export default function ImageGallery({ images, address }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [imageError, setImageError] = useState<Set<number>>(new Set());

    const handlePrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleImageError = (index: number) => {
        setImageError(prev => new Set(prev).add(index));
    };

    const currentImage = images[currentIndex];
    const hasError = imageError.has(currentIndex);

    return (
        <>
            {/* Main Gallery */}
            <div className="relative w-full h-full bg-slate-900 group">
                {/* Current Image */}
                {currentImage && !hasError ? (
                    <img
                        src={currentImage}
                        alt={`${address} - Image ${currentIndex + 1}`}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(currentIndex)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                        <div className="text-center text-slate-500">
                            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-800 flex items-center justify-center">
                                <Expand size={24} />
                            </div>
                            <p className="text-sm">No image available</p>
                        </div>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 text-white text-sm">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}

                {/* Expand Button */}
                {currentImage && !hasError && (
                    <button
                        onClick={() => setIsLightboxOpen(true)}
                        className="absolute bottom-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Expand size={20} />
                    </button>
                )}

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex gap-2 justify-center">
                            {images.slice(0, 5).map((img, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentIndex(index);
                                    }}
                                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${index === currentIndex
                                            ? 'border-white scale-110'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    {!imageError.has(index) ? (
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={() => handleImageError(index)}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-700" />
                                    )}
                                </button>
                            ))}
                            {images.length > 5 && (
                                <div className="w-12 h-12 rounded-lg bg-black/50 flex items-center justify-center text-white text-sm font-medium">
                                    +{images.length - 5}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {isLightboxOpen && currentImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <X size={24} className="text-white" />
                        </button>

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevious}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                    <ChevronLeft size={32} className="text-white" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                    <ChevronRight size={32} className="text-white" />
                                </button>
                            </>
                        )}

                        <img
                            src={currentImage}
                            alt={`${address} - Full size`}
                            className="max-w-full max-h-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {images.length > 1 && (
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white">
                                {currentIndex + 1} / {images.length}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
