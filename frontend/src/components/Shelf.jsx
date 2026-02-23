import React from 'react';

const Shelf = ({ title, count = null, children, emptyMessage = 'No items found on this shelf.' }) => {
    return (
        <section className="mb-10 w-full animate-fade-in">
            <div className="flex items-baseline gap-3 mb-4 border-b-2 border-border/60 pb-2">
                <h2 className="font-display text-2xl font-bold tracking-tight text-text">
                    {title}
                </h2>
                {count !== null && (
                    <span className="bg-accent-100 text-accent-700 dark:bg-accent-950 dark:text-accent-400 font-bold text-sm px-2 py-0.5 rounded-full border border-accent-200 dark:border-accent-800">
                        {count}
                    </span>
                )}
            </div>

            <div className="bg-surface/50 dark:bg-slate-800/20 rounded-xl p-4 sm:p-6 border border-border/50 min-h-[160px]">
                {React.Children.count(children) > 0 ? (
                    <div className="flex flex-col gap-4">
                        {children}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-text-muted py-8 text-center bg-surface/80 rounded-lg border border-dashed border-border">
                        <p className="font-medium">{emptyMessage}</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Shelf;
