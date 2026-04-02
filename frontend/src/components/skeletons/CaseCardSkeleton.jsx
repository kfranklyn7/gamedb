import React from 'react';

const CaseCardSkeleton = () => {
    return (
        <div className="flex flex-col sm:flex-row gap-6 p-5 w-full bg-surface border border-border shadow-md rounded-2xl overflow-hidden animate-pulse">
            {/* Image Box Placeholder */}
            <div className="w-full sm:w-[140px] shrink-0 aspect-[3/4] bg-border/20 rounded-xl relative">
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-border/30"></div>
            </div>

            {/* Content Placeholder */}
            <div className="flex-grow flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-2 w-full">
                        <div className="h-5 bg-border/30 rounded inline-block w-2/3 max-w-xs"></div>
                        <div className="flex gap-2">
                             <div className="h-4 w-12 bg-border/20 rounded"></div>
                             <div className="h-4 w-20 bg-border/20 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Score Boxes Placeholder */}
                <div className="flex gap-2">
                    <div className="h-10 w-20 bg-border/20 rounded-lg"></div>
                    <div className="h-10 w-20 bg-border/20 rounded-lg"></div>
                </div>
                
                {/* Divider & Metadata Placeholder */}
                <div className="mt-auto pt-4 border-t border-border flex justify-between items-end">
                     <div className="h-3 bg-border/20 rounded w-1/3"></div>
                     <div className="h-6 bg-border/20 rounded w-16"></div>
                </div>
            </div>
        </div>
    );
};

export default CaseCardSkeleton;
