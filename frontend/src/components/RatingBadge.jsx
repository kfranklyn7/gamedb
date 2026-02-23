import React from 'react';

const RatingBadge = ({ rating, count, size = 'md' }) => {
    if (rating == null) return null;

    // Rating is typically 0-100 logic (from IGDB), let's format it to 1 decimal like 8.5
    // or just round to integer. Looks like IGDB gives 0-100. Let's round to nearest int, or divide by 10.
    // The backend double might be 1-100.
    const displayRating = (rating / 10).toFixed(1);
    const colorClass =
        rating >= 80 ? 'bg-green-100 text-green-700 border-green-200' :
            rating >= 60 ? 'bg-amber-100 text-amber-700 border-amber-200' :
                'bg-red-100 text-red-700 border-red-200';

    const sizeClass = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-1',
        lg: 'text-lg px-3 py-1.5'
    }[size];

    return (
        <div className={`flex items-center gap-1 font-display font-medium rounded-full border ${colorClass} ${sizeClass}`} title={`${count ? count + ' ratings' : 'Rating'}`}>
            <span>⭐</span>
            <span>{displayRating}</span>
        </div>
    );
};

export default RatingBadge;
