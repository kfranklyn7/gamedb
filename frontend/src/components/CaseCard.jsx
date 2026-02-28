import React from 'react';
import { Link } from 'react-router-dom';
import { getParsedCover } from '../utils/imageUtils';
import { Edit3, Trash2, CalendarDays, RefreshCw } from 'lucide-react';
import ScoreBox from './ScoreBox';
import CategoryTag from './CategoryTag';
import StatusBadge from './StatusBadge';
import IgdbLink from './IgdbLink';

const priorityConfig = {
    HIGH: 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/40 border-red-200 dark:border-red-900',
    MEDIUM: 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
    LOW: 'text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
};

const CaseCard = ({ listItem, onEdit, onDelete }) => {
    const {
        game, status, personalRating,
        replayCount, startedAt, completedAt, priority
    } = listItem;

    const coverUrl = getParsedCover(game.cover);

    const publisher = game.publishers?.[0] || '';
    const developer = game.developers?.[0] || '';
    const pubDev = [publisher, developer].filter(Boolean).join(' · ');

    const genreTags = game.genreNames || [];
    const platformTags = game.platforms || [];
    const themeTags = game.themes || [];
    const keywordTags = game.keywordNames || [];
    const gameModeTags = game.gameModes || [];

    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        return new Date(dateStr).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    return (
        <div className="group relative flex flex-col md:flex-row bg-surface border border-border shadow-md hover:shadow-xl transition-shadow rounded-xl overflow-hidden w-full max-w-5xl mx-auto">

            {/* The Vertical Physical Game Case */}
            <div className="p-4 sm:p-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-black/50 flex flex-col items-center justify-center shrink-0 border-b md:border-b-0 md:border-r border-border relative z-0">
                {/* 3D Case Container - Aspect ratio roughly 3:4 */}
                <Link to={`/game/${game.igdbId}`} className="relative w-[150px] sm:w-[180px] aspect-[1/1.3] block rounded-[4px] shadow-[4px_10px_20px_rgba(0,0,0,0.6)] bg-[#0a0f18] transform-gpu transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">

                    {/* The Plastic Spine Header Top Edge */}
                    <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-white/20 to-transparent rounded-t-[4px] opacity-60 z-20 pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]"></div>

                    {/* The Plastic Spine (Left Edge) */}
                    <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-white/30 to-transparent rounded-l-[4px] border-r border-white/10 z-20 shadow-[inset_1px_0_2px_rgba(255,255,255,0.5)]"></div>

                    {/* The Cover Art (Recessed slightly under plastic) */}
                    <div className="absolute top-[2px] bottom-[2px] right-[2px] left-[10px] bg-black rounded-r-[3px] rounded-l-sm overflow-hidden">
                        <img src={coverUrl} alt="Cover" className="w-full h-full object-cover shadow-[inset_0_0_10px_rgba(0,0,0,1)]" />
                    </div>

                    {/* Outer Plastic Film Highlight / Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none rounded-[4px] z-30 shadow-[inset_0_0_1px_rgba(255,255,255,0.4)] mix-blend-screen opacity-70"></div>

                    {/* Angled Glare Line */}
                    <div className="absolute top-0 right-0 bottom-0 w-[60px] bg-gradient-to-l from-white/10 to-transparent pointer-events-none z-30 skew-x-12 opacity-50 mix-blend-screen -translate-x-4"></div>
                </Link>
            </div>

            {/* Detailed Metadata Panel */}
            <div className="flex-grow flex flex-col p-5 sm:p-6 relative z-10 w-full min-w-0 bg-surface">

                {/* Header & Scores */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div className="min-w-0">
                        <Link to={`/game/${game.igdbId}`} className="hover:text-accent-500 transition-colors">
                            <h3 className="font-display font-bold text-2xl sm:text-3xl text-text leading-tight line-clamp-2">{game.name}</h3>
                        </Link>
                        {pubDev && <p className="text-sm font-semibold text-text-muted mt-1 truncate uppercase tracking-widest">{pubDev}</p>}
                    </div>

                    <div className="flex gap-2 shrink-0">
                        <ScoreBox type="community" score={game.total_rating} voteCount={game.total_rating_count} size="md" />
                        <ScoreBox type="personal" score={personalRating} size="md" />
                    </div>
                </div>

                {/* Status + Dates + Extras */}
                <div className="flex flex-wrap items-center gap-2 mb-6 text-xs font-semibold">
                    <StatusBadge status={status} size="md" />

                    {startedAt && (
                        <div className="flex items-center gap-1.5 text-text-muted bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md shadow-sm">
                            <CalendarDays size={14} className="text-accent-500" />
                            <span>Started: {formatDate(startedAt)}</span>
                        </div>
                    )}
                    {completedAt && (
                        <div className="flex items-center gap-1.5 text-text-muted bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md shadow-sm">
                            <CalendarDays size={14} className="text-green-500" />
                            <span>Finished: {formatDate(completedAt)}</span>
                        </div>
                    )}
                    {priority && (
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border shadow-sm ${priorityConfig[priority]}`}>
                            {priority === 'HIGH' ? '🔥 High Priority' : priority === 'MEDIUM' ? '⭐ Medium Priority' : '⏳ Low Priority'}
                        </div>
                    )}
                    {replayCount > 0 && (
                        <div className="flex items-center gap-1.5 text-text-muted bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md shadow-sm">
                            <RefreshCw size={14} className="text-blue-500" />
                            <span>Replayed: {replayCount}x</span>
                        </div>
                    )}
                </div>

                {/* Detailed Tags Section */}
                <div className="flex-grow space-y-4 max-w-4xl">
                    {genreTags.length > 0 && (
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                            <span className="w-20 shrink-0 text-[10px] font-black uppercase tracking-widest text-text-muted/70">Genres</span>
                            <div className="flex flex-wrap gap-2">
                                {genreTags.map(g => <CategoryTag key={g} category="genre" value={g} size="sm" />)}
                            </div>
                        </div>
                    )}
                    {platformTags.length > 0 && (
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                            <span className="w-20 shrink-0 text-[10px] font-black uppercase tracking-widest text-text-muted/70">Platforms</span>
                            <div className="flex flex-wrap gap-2">
                                {platformTags.map(p => <CategoryTag key={p} category="platform" value={p} size="sm" />)}
                            </div>
                        </div>
                    )}
                    {themeTags.length > 0 && (
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                            <span className="w-20 shrink-0 text-[10px] font-black uppercase tracking-widest text-text-muted/70">Themes</span>
                            <div className="flex flex-wrap gap-2">
                                {themeTags.map(t => <CategoryTag key={t} category="theme" value={t} size="sm" />)}
                            </div>
                        </div>
                    )}
                    {keywordTags.length > 0 && (
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                            <span className="w-20 shrink-0 text-[10px] font-black uppercase tracking-widest text-text-muted/70">Keywords</span>
                            <div className="flex flex-wrap gap-2">
                                {keywordTags.map(k => <CategoryTag key={k} category="keyword" value={k} size="sm" />)}
                            </div>
                        </div>
                    )}
                    {gameModeTags.length > 0 && (
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                            <span className="w-20 shrink-0 text-[10px] font-black uppercase tracking-widest text-text-muted/70">Game Modes</span>
                            <div className="flex flex-wrap gap-2">
                                {gameModeTags.map(m => <CategoryTag key={m} category="gameMode" value={m} size="sm" />)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions Footer */}
                <div className="mt-6 pt-4 border-t border-border flex justify-between items-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-3">
                        <button onClick={() => onEdit(listItem)} className="flex items-center gap-2 px-4 py-2 bg-accent-50 text-accent-600 hover:bg-accent-100 dark:bg-accent-900/30 dark:text-accent-400 dark:hover:bg-accent-900/50 rounded-lg text-sm font-bold transition-colors">
                            <Edit3 size={16} /> Update Journal
                        </button>
                        <button onClick={() => onDelete(game.igdbId)} className="flex items-center gap-2 px-4 py-2 text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-sm font-bold transition-colors">
                            <Trash2 size={16} /> Abandon Quest
                        </button>
                    </div>
                    <IgdbLink url={game.url} slug={game.slug} variant="button" size="sm" />
                </div>
            </div>
        </div>
    );
};

export default CaseCard;
