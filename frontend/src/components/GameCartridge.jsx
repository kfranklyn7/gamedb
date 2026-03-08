import React from 'react';
import { Link } from 'react-router-dom';
import { getParsedCover } from '../utils/imageUtils';
import StatusBadge, { STATUS_CONFIG } from './StatusBadge';
import { Edit3, Trash2 } from 'lucide-react';

const GameCartridge = ({ listItem, onEdit, onDelete }) => {
    const { game, status, personalRating, lastUpdated } = listItem;
    const coverUrl = getParsedCover(game.cover);

    const config = STATUS_CONFIG[status];
    const borderStyle = config ? config.colorBorder : 'border-border';
    const bgStyle = config ? config.colorBg : 'bg-surface';

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className={`group flex flex-col sm:flex-row relative overflow-hidden rounded-xl border-l-4 sm:border-l-[6px] border border-border shadow-sm hover:shadow-md transition-all duration-200 ${bgStyle}`} style={{ borderLeftColor: 'currentColor' }}>

            {/* Decorative border matching status color handled by inline style or tailwind variable if we had it. We can just inject the tailwind border color by overriding border-l */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${config?.colorBg.split(' ')[0].replace('bg-', 'bg-')} ${borderStyle.replace('border-', 'bg-')}`}></div>

            {/* Cover */}
            <Link to={`/game/${game.igdbId}`} className="shrink-0 w-full sm:w-[90px] h-[120px] bg-slate-200 block pl-1.5 sm:pl-0">
                <img src={coverUrl} alt={game.name} className="w-full h-full object-cover" loading="lazy" />
            </Link>

            {/* Content */}
            <div className="flex flex-col sm:flex-row flex-grow p-3 gap-3 ml-1.5 sm:ml-0">

                {/* Info Area */}
                <div className="flex-grow flex flex-col justify-center">
                    <Link to={`/game/${game.igdbId}`} className="hover:text-accent-600 transition-colors">
                        <h3 className="font-display font-medium text-lg leading-tight mb-1 line-clamp-2">{game.name}</h3>
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <StatusBadge status={status} size="sm" />
                        {/* Add platform badges here to fix regression of missing platforms */}
                        {(game.platformData || []).slice(0, 2).map((p, idx) => (
                            <CategoryTag
                                key={p.id || idx}
                                category="platform"
                                value={p.name}
                                logoUrl={p.logoUrl}
                                family={p.family}
                                size="xs"
                            />
                        ))}
                        <span className="text-xs text-text-muted">Updated: {formatDate(lastUpdated)}</span>
                    </div>
                </div>

                {/* Action / Stats Area */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 sm:border-l border-border/50 pt-2 sm:pt-0 pl-0 sm:pl-4 mt-2 sm:mt-0 gap-2">

                    <div className="flex flex-col items-center">
                        <span className="text-xs text-text-muted uppercase tracking-wider mb-0.5 font-bold">Your XP</span>
                        <div className="font-display text-lg font-bold text-accent-600 dark:text-accent-400">
                            {personalRating ? `${personalRating}/10` : '--/10'}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:mt-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onEdit(listItem)}
                            className="p-1.5 text-text-muted hover:text-accent-500 hover:bg-accent-50 rounded bg-white dark:bg-slate-800 shadow-sm border border-border"
                            title="Edit Quest Entry"
                        >
                            <Edit3 size={16} />
                        </button>
                        <button
                            onClick={() => onDelete(game.igdbId)}
                            className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-50 rounded bg-white dark:bg-slate-800 shadow-sm border border-border"
                            title="Abandon Quest (Delete)"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GameCartridge;
