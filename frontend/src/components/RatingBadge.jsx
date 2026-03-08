import React from 'react';

const RatingBadge = ({ rating, count, size = 'md' }) => {
    if (rating == null) return null;

    // Rating is typically 0-100 logic (from IGDB), let's format it to 1 decimal like 8.5
    // or just round to integer. Looks like IGDB gives 0-100. Let's round to nearest int, or divide by 10.
    // The backend double might be 1-100.
    const displayRating = (rating / 10).toFixed(1);
    const colorClass =
        rating >= 80 ? 'bg-green-500 text-white border-green-600 shadow-retro' :
            rating >= 60 ? 'bg-amber-500 text-white border-amber-600 shadow-retro' :
                'bg-red-500 text-white border-red-600 shadow-retro';

    const sizeClass = {
        sm: 'text-[10px] px-1.5 py-0.5',
        md: 'text-xs px-2 py-1',
        lg: 'text-sm px-3 py-1.5'
    }[size];

    return (
        <div className={`flex items-center gap-1 font-display font-bold rounded-dynamic-btn terminal-border ${colorClass} ${sizeClass}`} title={`${count ? count + ' ratings' : 'Rating'}`}>
            <span className="text-[10px]">★</span>
            <span>{displayRating}</span>
        </div>
    );
};

export default RatingBadge;
