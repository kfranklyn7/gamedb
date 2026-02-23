import React, { useState } from 'react';
import { ArrowUpDown, Filter, ChevronDown, X } from 'lucide-react';
import CategoryTag from './CategoryTag';
import ViewToggle from './ViewToggle';

const SORT_OPTIONS = [
    { key: 'name-asc', label: 'Name (A→Z)' },
    { key: 'name-desc', label: 'Name (Z→A)' },
    { key: 'rating-desc', label: 'Community Score ↓' },
    { key: 'rating-asc', label: 'Community Score ↑' },
    { key: 'personal-desc', label: 'Personal Rating ↓' },
    { key: 'personal-asc', label: 'Personal Rating ↑' },
    { key: 'updated-desc', label: 'Recently Updated' },
    { key: 'updated-asc', label: 'Oldest Updated' },
    { key: 'priority-desc', label: 'Priority (High→Low)' },
];

/**
 * SortFilterBar — Combined toolbar for sort, filter, and view controls.
 *
 * @param {string} sortBy - Current sort key
 * @param {(sort: string) => void} onSortChange
 * @param {Object} availableFilters - { genre: string[], platform: string[], theme: string[] }
 * @param {Object} activeFilters - { genre: string[], platform: string[], theme: string[] }
 * @param {(category: string, value: string) => void} onFilterToggle
 * @param {() => void} onClearFilters
 * @param {string} activeView
 * @param {(view: string) => void} onViewChange
 * @param {boolean} showCase
 */
const SortFilterBar = ({
    sortBy = 'name-asc',
    onSortChange,
    availableFilters = {},
    activeFilters = {},
    onFilterToggle,
    onClearFilters,
    activeView,
    onViewChange,
    showCase = true,
}) => {
    const [filtersExpanded, setFiltersExpanded] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);

    const currentSort = SORT_OPTIONS.find(o => o.key === sortBy) || SORT_OPTIONS[0];
    const hasActiveFilters = Object.values(activeFilters).some(arr => arr?.length > 0);
    const totalActiveFilters = Object.values(activeFilters).reduce((n, arr) => n + (arr?.length || 0), 0);

    return (
        <div className="space-y-2 mb-4">
            {/* Top row: Sort + View toggle */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                {/* Sort dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setSortOpen(!sortOpen)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium
                       rounded-lg bg-surface shadow-sm
                       hover:bg-slate-50 dark:hover:bg-slate-800
                       text-text transition-colors"
                    >
                        <ArrowUpDown size={14} className="text-text-muted" />
                        <span>{currentSort.label}</span>
                        <ChevronDown size={14} className={`text-text-muted transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {sortOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                            <div className="absolute top-full left-0 mt-1 z-20 w-56
                              bg-surface border border-border rounded-lg shadow-lg
                              py-1 animate-fade-in">
                                {SORT_OPTIONS.map(opt => (
                                    <button
                                        key={opt.key}
                                        type="button"
                                        onClick={() => { onSortChange(opt.key); setSortOpen(false); }}
                                        className={`w-full text-left px-3 py-2 text-sm transition-colors
                      ${opt.key === sortBy
                                                ? 'bg-accent-50 dark:bg-accent-950/30 text-accent-700 dark:text-accent-400 font-medium'
                                                : 'text-text hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {/* Filter toggle button */}
                    <button
                        type="button"
                        onClick={() => setFiltersExpanded(!filtersExpanded)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium
                        rounded-lg transition-colors shadow-sm
                        ${filtersExpanded || hasActiveFilters
                                ? 'bg-accent-100 dark:bg-accent-950/40 text-accent-700 dark:text-accent-400'
                                : 'bg-surface text-text-muted hover:text-text hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <Filter size={14} />
                        <span>Filter</span>
                        {totalActiveFilters > 0 && (
                            <span className="bg-accent-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                {totalActiveFilters}
                            </span>
                        )}
                    </button>

                    {/* View Toggle */}
                    <ViewToggle
                        activeView={activeView}
                        onViewChange={onViewChange}
                        showCase={showCase}
                    />
                </div>
            </div>

            {/* Filter chips panel — collapsible */}
            {filtersExpanded && (
                <div className="p-3 bg-surface rounded-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] animate-fade-in space-y-3">
                    {/* Clear all button */}
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={onClearFilters}
                            className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-400 font-medium transition-colors"
                        >
                            <X size={12} />
                            Clear all filters
                        </button>
                    )}

                    {/* Genre filters */}
                    {availableFilters.genre?.length > 0 && (
                        <div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-text-muted block mb-1.5">Genres</span>
                            <div className="flex flex-wrap gap-1">
                                {availableFilters.genre.map(g => (
                                    <CategoryTag
                                        key={g}
                                        category="genre"
                                        value={g}
                                        size="sm"
                                        active={activeFilters.genre?.includes(g)}
                                        onClick={() => onFilterToggle('genre', g)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Platform filters */}
                    {availableFilters.platform?.length > 0 && (
                        <div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-text-muted block mb-1.5">Platforms</span>
                            <div className="flex flex-wrap gap-1">
                                {availableFilters.platform.map(p => (
                                    <CategoryTag
                                        key={p}
                                        category="platform"
                                        value={p}
                                        size="sm"
                                        active={activeFilters.platform?.includes(p)}
                                        onClick={() => onFilterToggle('platform', p)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Theme filters */}
                    {availableFilters.theme?.length > 0 && (
                        <div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-text-muted block mb-1.5">Themes</span>
                            <div className="flex flex-wrap gap-1">
                                {availableFilters.theme.map(t => (
                                    <CategoryTag
                                        key={t}
                                        category="theme"
                                        value={t}
                                        size="sm"
                                        active={activeFilters.theme?.includes(t)}
                                        onClick={() => onFilterToggle('theme', t)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SortFilterBar;
