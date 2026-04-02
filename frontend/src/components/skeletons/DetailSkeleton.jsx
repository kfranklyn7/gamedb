import React from 'react';

const DetailSkeleton = () => {
    return (
        <div className="animate-pulse relative">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-border shadow-xl">
                <div className="absolute inset-0 bg-slate-900/50"></div>
                <div className="relative p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-start md:items-end">
                    
                    {/* Cover Image Placeholder */}
                    <div className="w-48 sm:w-64 shrink-0 aspect-[3/4] bg-white/10 rounded-xl shadow-2xl border-2 border-white/5"></div>
                    
                    {/* Text Placeholder */}
                    <div className="flex-grow flex flex-col items-start gap-4 w-full">
                        {/* Tags */}
                        <div className="flex gap-2">
                            <div className="h-6 w-16 bg-white/10 rounded-full"></div>
                            <div className="h-6 w-32 bg-white/10 rounded-full"></div>
                        </div>
                        
                        {/* Title */}
                        <div className="h-12 sm:h-16 bg-white/10 rounded-lg w-3/4 max-w-lg mt-2"></div>
                        
                        {/* Buttons & Scores */}
                        <div className="flex items-center gap-4 mt-2">
                            <div className="h-16 w-24 bg-white/10 rounded-lg"></div>
                            <div className="h-12 w-36 bg-white/10 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                
                {/* Left Column (Synopsis & Media) */}
                <div className="md:col-span-2 space-y-10">
                    <section>
                        <div className="h-6 w-32 bg-border/30 rounded mb-4"></div>
                        <div className="p-6 rounded-2xl bg-surface border border-border shadow-sm space-y-3">
                            <div className="h-4 bg-border/20 rounded w-full"></div>
                            <div className="h-4 bg-border/20 rounded w-full"></div>
                            <div className="h-4 bg-border/20 rounded w-5/6"></div>
                            <div className="h-4 bg-border/20 rounded w-4/6"></div>
                        </div>
                    </section>

                    <section>
                        <div className="h-6 w-24 bg-border/30 rounded mb-4"></div>
                        <div className="flex gap-4 overflow-hidden">
                            <div className="h-40 w-72 bg-border/20 rounded-xl shrink-0"></div>
                            <div className="h-40 w-72 bg-border/20 rounded-xl shrink-0"></div>
                        </div>
                    </section>
                </div>

                {/* Right Column (Tags) */}
                <div className="space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
                            <div className="h-3 w-16 bg-border/30 rounded mb-3"></div>
                            <div className="flex flex-wrap gap-1.5">
                                <div className="h-6 w-20 bg-border/20 rounded-full"></div>
                                <div className="h-6 w-24 bg-border/20 rounded-full"></div>
                                <div className="h-6 w-16 bg-border/20 rounded-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DetailSkeleton;
