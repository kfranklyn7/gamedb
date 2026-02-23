import React from 'react';
import { ExternalLink } from 'lucide-react';

/**
 * IgdbLink — attribution link that opens the game's IGDB page.
 * Uses the stored `url` field, or auto-generates from `slug`.
 *
 * @param {string} url - Full IGDB URL (from game.url field)
 * @param {string} slug - IGDB slug (fallback for URL generation)
 * @param {'inline'|'button'} variant
 * @param {'sm'|'md'} size
 */
const IgdbLink = ({ url, slug, variant = 'inline', size = 'sm' }) => {
    const href = url || (slug ? `https://www.igdb.com/games/${slug}` : null);

    if (!href) return null;

    if (variant === 'button') {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`
          inline-flex items-center gap-1.5 font-medium rounded-lg
          border border-border bg-surface hover:bg-accent-50 hover:border-accent-300
          dark:hover:bg-accent-950/30 dark:hover:border-accent-700
          text-text-muted hover:text-accent-600 dark:hover:text-accent-400
          transition-all duration-150
          ${size === 'sm' ? 'text-xs px-2.5 py-1.5' : 'text-sm px-3 py-2'}
        `}
                title="View on IGDB"
            >
                <ExternalLink size={size === 'sm' ? 12 : 14} />
                <span>View on IGDB</span>
            </a>
        );
    }

    // Inline variant — small icon link
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-text-muted hover:text-accent-500 transition-colors text-xs"
            title="View on IGDB"
        >
            <ExternalLink size={12} />
            <span className="sr-only">View on IGDB</span>
        </a>
    );
};

/**
 * IgdbAttribution — static footer attribution line.
 */
export const IgdbAttribution = () => (
    <div className="text-center text-xs text-text-muted py-2">
        Game data provided by{' '}
        <a
            href="https://www.igdb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent-500 hover:text-accent-400 hover:underline transition-colors"
        >
            IGDB.com
        </a>
    </div>
);

export default IgdbLink;
