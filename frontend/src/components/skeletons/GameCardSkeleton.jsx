import React from 'react';

const GameCardSkeleton = () => {
    return (
        <div className="relative flex flex-col w-full aspect-[3/4] bg-surface border border-border shadow-md rounded-dynamic overflow-hidden animate-pulse">
            {/* Image Placeholder */}
            <div className="w-full h-[75%] bg-border/20 rounded-t-dynamic relative">
                {/* Simulated category pills */}
                <div className="absolute top-2 left-2 flex gap-1">
                     <div className="w-6 h-6 rounded-full bg-border/30"></div>
                     <div className="w-6 h-6 rounded-full bg-border/30"></div>
                </div>
            </div>
            
            {/* Content Placeholder */}
            <div className="w-full flex-grow p-4 space-y-3 flex flex-col justify-end">
                <div className="h-4 bg-border/30 rounded w-3/4"></div>
                <div className="h-3 bg-border/20 rounded w-1/2"></div>
                
                <div className="flex gap-2 mt-auto pt-2">
                     <div className="h-6 w-12 bg-border/20 rounded-md"></div>
                     <div className="h-6 w-16 bg-border/20 rounded-md"></div>
                </div>
            </div>
        </div>
    );
};

export default GameCardSkeleton;
