import React, { useState } from 'react';
import { getTagColor, getTagStyles, getTagIcon, getBrandLogo } from './CategoryTagConfig';

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
    logoUrl = null,
    family = null,
    iconOnly = false,
}) => {
    if (!value) return null;

    const hexColor = getTagColor(category, value);
    const isDark = document.documentElement.classList.contains('dark');
    const defaultStyles = getTagStyles(hexColor, isDark);
    const Icon = getTagIcon(category, value, family);

    const sizeClasses = {
        xs: 'text-[9px] px-1.5 py-0.5 gap-1 min-h-[16px]',
        sm: 'text-[11px] px-2 py-0.5 gap-1 min-h-[20px]',
        md: 'text-xs px-2.5 py-1 gap-1.5 min-h-[24px]',
        lg: 'text-sm px-3 py-1.5 gap-2 min-h-[28px]',
    };

    const iconSizes = { xs: 9, sm: 11, md: 13, lg: 15 };

    const activeStyles = active
        ? { background: `${hexColor}40`, borderColor: hexColor, fontWeight: 600 }
        : {};

    const hasSpecificBrandIcon = Icon && category === 'platform' && Icon.name !== 'Gamepad2' && Icon.name !== 'LucideIcon';

    const brandLogoUrl = category === 'platform' ? getBrandLogo(value, family, isDark) : null;
    const finalLogoUrl = brandLogoUrl || logoUrl;

    const isGraphicLogoOnly = false;

    let styles = { ...defaultStyles, ...activeStyles };

    const renderIcon = () => {
        if (!showIcon) return null;

        if (finalLogoUrl) {
            const isPlatform = category === 'platform';
            const safeLogoUrl = typeof finalLogoUrl === 'string' && finalLogoUrl.startsWith('//')
                ? `https:${finalLogoUrl}`
                : finalLogoUrl;

            return (
                <img
                    src={safeLogoUrl}
                    alt=""
                    className={`object-contain ${isGraphicLogoOnly ? '' : 'drop-shadow-sm filter brightness-110 contrast-110'}`}
                    style={{
                        width: 'auto',
                        maxWidth: '120px',
                        height: isGraphicLogoOnly ? iconSizes[size] * 1.5 : (isPlatform ? iconSizes[size] * 1.8 : iconSizes[size] * 1.5)
                    }}
                />
            );
        }

        if (hasSpecificBrandIcon) {
            return <Icon size={Icon.name === 'SiNintendo' ? iconSizes[size] * 2.2 : iconSizes[size] * 1.4} />;
        }

        if (Icon) {
            return <Icon size={iconSizes[size]} />;
        }

        return null;
    };

    const renderedIcon = renderIcon();
    // Hide text if iconOnly is passed and icon is successfully grabbed.
    const shouldHideText = iconOnly && renderedIcon;

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!onClick}
            className={`
        inline-flex items-center rounded-lg font-medium border max-w-full
        transition-all duration-150 whitespace-nowrap
        ${onClick ? 'cursor-pointer hover:shadow-sm hover:scale-[1.03]' : 'cursor-default'}
        ${sizeClasses[size]} ${shouldHideText ? '!px-1.5 justify-center' : ''}
      `}
            style={styles}
            title={`${category}: ${value}`}
            aria-label={`${category}: ${value}`}
        >
            {renderedIcon && (
                <span className="shrink-0 flex items-center justify-center" aria-hidden="true">
                    {renderedIcon}
                </span>
            )}
            {!shouldHideText && <span className="truncate">{value}</span>}
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
