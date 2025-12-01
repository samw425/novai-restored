import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
    return (
        <div
            className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
