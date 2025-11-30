'use client';

import { Category } from '@/types';

const categories: (Category | 'all')[] = ['all', 'ai', 'research', 'robotics', 'policy', 'market', 'tools'];

export function FeedHeader({
    activeCategory,
    onCategoryChange
}: {
    activeCategory: string;
    onCategoryChange: (cat: string) => void;
}) {
    return (
        <div className="sticky top-[64px] z-40 bg-[#F5F6F8]/95 backdrop-blur py-4 border-b border-transparent">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onCategoryChange(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap ${activeCategory === cat
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
}
