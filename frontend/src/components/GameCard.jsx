import React from 'react';
import { Link } from 'react-router-dom';
import RatingBadge from './RatingBadge';
import CategoryTag from './CategoryTag';

const GameCard = ({ game }) => {
    const coverUrl = game.cover ? `https:${game.cover.replace('t_thumb', 't_cover_big')}` : 'https://placehold.co/264x352?text=No+Cover';
    const year = game.releaseDate ? new Date(game.releaseDate).getFullYear() : 'TBA';

    const genreTags = game.genreNames || [];
    const MAX_GENRES = 2;
    const visibleGenres = genreTags.slice(0, MAX_GENRES);
    const overflowCount = genreTags.length - MAX_GENRES;

    return (
        <Link
            to={`/game/${game.igdbId}`}
            className="group flex flex-col bg-surface border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-accent-400 transition-all duration-300 transform hover:-translate-y-1"
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                    src={coverUrl}
                    alt={game.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <div className="flex flex-wrap gap-1">
                        {game.platforms?.slice(0, 3).map(p => (
                            <span key={p} className="text-[10px] font-bold text-white bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/20">
                                {p}
                            </span>
                        ))}
                        {game.platforms?.length > 3 && (
                            <span className="text-[10px] font-bold text-white bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/20">
                                +{game.platforms.length - 3}
                            </span>
                        )}
                    </div>
                </div>
                {game.total_rating && (
                    <div className="absolute top-2 right-2 shadow-md rounded-full">
                        <RatingBadge rating={game.total_rating} size="sm" />
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow gap-2">
                <h3 className="font-display font-medium text-lg leading-tight line-clamp-2 group-hover:text-accent-500 transition-colors">
                    {game.name}
                </h3>

                {/* Genre tags */}
                {visibleGenres.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {visibleGenres.map(g => (
                            <CategoryTag key={g} category="genre" value={g} size="sm" />
                        ))}
                        {overflowCount > 0 && (
                            <span className="text-[10px] font-bold text-text-muted bg-background border border-dashed border-border px-1.5 py-0.5 rounded">
                                +{overflowCount}
                            </span>
                        )}
                    </div>
                )}

                <p className="text-sm text-text-muted mt-auto">
                    {year}
                    {game.developers?.length > 0 && <span className="ml-2">• {game.developers[0]}</span>}
                </p>
            </div>
        </Link>
    );
};

export default GameCard;
