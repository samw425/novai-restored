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
        <div className="sticky top-[64px] z-40 bg-white border-b border-gray-100 py-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onCategoryChange(cat)}
                        className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all whitespace-nowrap ${activeCategory === cat
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
}
