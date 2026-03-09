import React from 'react';
import { Link } from 'react-router-dom';
import { getParsedCover } from '../utils/imageUtils';
import RatingBadge from './RatingBadge';
import CategoryTag from './CategoryTag';

const GameCard = ({ game }) => {
    const coverUrl = getParsedCover(game.cover);

    // Format full date if available
    const dateObj = game.releaseDate ? new Date(game.releaseDate) : null;
    let formattedDate = 'TBA';
    if (dateObj && !isNaN(dateObj)) {
        // e.g., "Oct 25, 2024" or default locale string
        formattedDate = dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }

    const genreTags = game.genreNames || game.genres || [];
    const platformTags = game.platforms || game.platformNames || [];
    const themeTags = game.themes || [];

    const MAX_GENRES = 10;
    const MAX_THEMES = 10;
    const MAX_PLATFORMS_MOBILE = 3;
    const visibleGenres = genreTags.slice(0, MAX_GENRES);
    const visibleThemes = themeTags.slice(0, MAX_THEMES);

    const extractName = (arr) => {
        if (!arr || !Array.isArray(arr) || arr.length === 0) return null;
        return typeof arr[0] === 'object' ? arr[0].name : arr[0];
    };

    const developer = extractName(game.developerNames || game.developers);
    const publisher = extractName(game.publisherNames || game.publishers);

    return (
        <Link
            to={`/game/${game.igdbId}`}
            className="group flex flex-col bg-surface terminal-border rounded-dynamic overflow-hidden hover:border-accent-400 transition-all duration-300 transform hover:-translate-y-1 ui-glow"
        >
            {/* Title Above Cover */}
            <div className="px-3 pt-3 pb-2 bg-surface border-b border-border/20 z-10 shrink-0">
                <h3 className="font-display font-bold text-[13px] leading-tight line-clamp-2 group-hover:text-accent-500 transition-colors uppercase tracking-tight" title={game.name}>
                    {game.name}
                </h3>
            </div>

            {/* Cover Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800 game-card-img shrink-0 border-b border-border/20">
                <img
                    src={coverUrl}
                    alt={game.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {game.total_rating && (
                    <div className="absolute top-2 right-2 shadow-sm">
                        <RatingBadge rating={game.total_rating} size="sm" />
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="density-p-content flex flex-col flex-grow density-gap min-h-[90px] pt-3">

                {/* Platform badges */}
                {/* Platform badges */}
                <div className="flex flex-wrap gap-1 mb-1.5">
                    {Array.isArray(game.platformData || platformTags) && (game.platformData || platformTags).slice(0, 6).map((p, idx) => {
                        const isObject = typeof p === 'object' && p !== null;
                        const val = isObject ? p.name || p.value : p;
                        const logoUrl = isObject ? p.logoUrl : null;
                        const family = isObject ? p.family : null;
                        const key = isObject ? p.igdbId || p.id || val : p;

                        return (
                            <CategoryTag
                                key={key || idx}
                                category="platform"
                                value={val}
                                logoUrl={logoUrl}
                                family={family}
                                size="xs" // Shrunk to fit
                                iconOnly={false}
                            />
                        );
                    })}
                    {platformTags.length > 6 && (
                        <span className="text-[10px] font-black text-text-muted px-1.5 py-0.5 bg-background border border-border rounded-lg uppercase flex items-center justify-center min-w-[20px]">
                            +{platformTags.length - 6}
                        </span>
                    )}
                </div>

                {/* Genre & Theme tags */}
                {(visibleGenres.length > 0 || visibleThemes.length > 0) && (
                    <div className="flex flex-wrap gap-1">
                        {visibleGenres.map((g, idx) => {
                            const val = typeof g === 'object' && g !== null ? g.name || g.value : g;
                            const key = typeof g === 'object' && g !== null ? g.igdbId || g.id || val : g;
                            return <CategoryTag key={key || idx} category="genre" value={val} size="xs" />;
                        })}
                        {genreTags.length > MAX_GENRES && (
                            <span className="text-[10px] font-black text-text-muted px-1.5 py-0.5 bg-background border border-border rounded flex items-center justify-center">
                                +{genreTags.length - MAX_GENRES}
                            </span>
                        )}
                        {visibleThemes.map((t, idx) => {
                            const val = typeof t === 'object' && t !== null ? t.name || t.value : t;
                            const key = typeof t === 'object' && t !== null ? t.igdbId || t.id || val : t;
                            return <CategoryTag key={key || idx} category="theme" value={val} size="xs" />;
                        })}
                        {themeTags.length > MAX_THEMES && (
                            <span className="text-[10px] font-black text-text-muted px-1.5 py-0.5 bg-background border border-border rounded flex items-center justify-center">
                                +{themeTags.length - MAX_THEMES}
                            </span>
                        )}
                    </div>
                )}

                {/* Footer Box: Date, Dev, Pub encapsulated in a smaller rectangle */}
                <div className="mt-auto pt-2">
                    <div className="bg-background/80 dark:bg-black/20 border border-border/40 rounded flex flex-col p-2 gap-1 backdrop-blur-sm">
                        <span className="text-[9px] font-black tracking-widest text-text-muted uppercase">
                            {formattedDate}
                        </span>
                        {(developer || publisher) && (
                            <div className="flex items-center justify-between text-[10px] uppercase tracking-wide gap-2 leading-none">
                                <span className="text-accent-600 dark:text-accent-400 font-bold truncate flex-1" title={developer}>
                                    {developer || ''}
                                </span>
                                {publisher && publisher !== developer && (
                                    <span className="text-text-muted font-medium truncate flex-1 text-right" title={publisher}>
                                        {publisher}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default GameCard;
