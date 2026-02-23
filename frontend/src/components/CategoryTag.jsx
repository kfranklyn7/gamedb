import React, { useState } from 'react';
import { getTagColor, getTagStyles, getTagIcon } from './CategoryTagConfig';

/**
 * CategoryTag — a universal tag pill component.
 *
 * Displays a colored pill with a per-value icon and text label.
 * Genre icons are per-value (Compass for Adventure, Crosshair for Shooter, etc.).
 * Other categories use per-category icons (Moon for theme, Hash for keyword, etc.).
 *
 * @param {'genre'|'platform'|'theme'|'keyword'|'developer'|'publisher'|'gameMode'|'playerPerspective'|'other'} category
 * @param {string} value - Display text (e.g. "RPG", "Xbox Series X|S")
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} active - Whether this tag is acting as an active filter
 * @param {Function} onClick - If provided, tag acts as a clickable filter chip
 * @param {boolean} showIcon - Whether to show the category icon (default true)
 */
const CategoryTag = ({
    category,
    value,
    size = 'sm',
    active = false,
    onClick = null,
    showIcon = true,
}) => {
    if (!value) return null;

    const hexColor = getTagColor(category, value);
    const isDark = document.documentElement.classList.contains('dark');
    const styles = getTagStyles(hexColor, isDark);
    const Icon = getTagIcon(category, value);

    const sizeClasses = {
        sm: 'text-[11px] px-2 py-0.5 gap-1',
        md: 'text-xs px-2.5 py-1 gap-1.5',
        lg: 'text-sm px-3 py-1.5 gap-2',
    };

    const iconSizes = { sm: 11, md: 13, lg: 15 };

    const activeStyles = active
        ? { background: `${hexColor}40`, borderColor: hexColor, fontWeight: 600 }
        : {};

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!onClick}
            className={`
        inline-flex items-center rounded-lg font-medium border
        transition-all duration-150 whitespace-nowrap
        ${onClick ? 'cursor-pointer hover:shadow-sm hover:scale-[1.03]' : 'cursor-default'}
        ${sizeClasses[size]}
      `}
            style={{ ...styles, ...activeStyles }}
            title={`${category}: ${value}`}
            aria-label={`${category}: ${value}`}
        >
            {showIcon && Icon && (
                <span className="shrink-0 flex items-center" aria-hidden="true">
                    <Icon size={iconSizes[size]} />
                </span>
            )}
            <span className="truncate">{value}</span>
        </button>
    );
};

/**
 * CategoryTagOverflow — the "+N more" pill that expands to show hidden tags.
 */
export const CategoryTagOverflow = ({ count, tags, category, size = 'sm' }) => {
    const [expanded, setExpanded] = useState(false);

    if (count <= 0) return null;

    const sizeClasses = {
        sm: 'text-[11px] px-2 py-0.5 gap-1',
        md: 'text-xs px-2.5 py-1 gap-1.5',
        lg: 'text-sm px-3 py-1.5 gap-2',
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className={`
          inline-flex items-center rounded-lg font-medium
          border border-dashed border-current text-text-muted
          hover:text-accent-500 hover:border-accent-400
          transition-all duration-150 cursor-pointer
          ${sizeClasses[size]}
        `}
                title={tags?.map(t => t.value || t).join(', ')}
                aria-label={`Show ${count} more ${category} tags`}
            >
                +{count} more
            </button>
            {expanded && tags && (
                <div className="flex flex-wrap gap-1 animate-fade-in">
                    {tags.map((tag) => {
                        const val = tag.value || tag;
                        return (
                            <CategoryTag
                                key={val}
                                category={category}
                                value={val}
                                size={size}
                            />
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default CategoryTag;
