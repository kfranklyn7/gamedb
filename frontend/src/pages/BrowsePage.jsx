import React, { useState, useEffect, useMemo } from 'react';
import { gamesApi } from '../api/games';
import GameCard from '../components/GameCard';
import CategoryTag from '../components/CategoryTag';
import { Search, Filter, Loader2, ChevronRight, X, LayoutGrid, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react';
import { POPULAR_PLATFORMS } from '../components/CategoryTagConfig';

const BrowsePage = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [metadataLoading, setMetadataLoading] = useState(true);

    const [availablePlatforms, setAvailablePlatforms] = useState([]);
    const [availableGenres, setAvailableGenres] = useState([]);
    const [availableThemes, setAvailableThemes] = useState([]);
    const [platformSearch, setPlatformSearch] = useState('');
    const [tagSearch, setTagSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedThemes, setSelectedThemes] = useState([]);
    const [sortBy, setSortBy] = useState('total_rating');
    const [ascending, setAscending] = useState(false);
    const [page, setPage] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [expandPlatforms, setExpandPlatforms] = useState(false);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const PAGE_SIZE = 24;
    const [totalFound, setTotalFound] = useState(0);

    const loadGames = async () => {
        setLoading(true);
        try {
            const results = await gamesApi.searchAdvanced({
                searchTerm,
                platforms: selectedPlatforms.length > 0 ? selectedPlatforms.map(name => availablePlatforms.find(p => p.name === name)?.igdbId).filter(Boolean).map(String) : null,
                genres: selectedGenres.length > 0 ? selectedGenres.map(name => availableGenres.find(g => g.name === name)?.igdbId).filter(Boolean).map(String) : null,
                themes: selectedThemes.length > 0 ? selectedThemes.map(name => availableThemes.find(t => t.name === name)?.igdbId).filter(Boolean).map(String) : null,
                sortBy,
                sortDirection: ascending ? 'asc' : 'desc',
                page,
                size: PAGE_SIZE
            });
            // Handle both raw array and { games, total } wrap if API was changed
            if (results.games) {
                setGames(results.games);
                setTotalFound(results.total || 0);
                setHasNextPage(results.games.length === PAGE_SIZE);
            } else {
                setGames(results);
                setTotalFound(results.length); // Fallback
                setHasNextPage(results.length === PAGE_SIZE);
            }
        } catch (err) {
            console.error('Failed to load games', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [platforms, genres, themes] = await Promise.all([
                    gamesApi.getPlatforms(),
                    gamesApi.getGenres(),
                    gamesApi.getThemes()
                ]);
                setAvailablePlatforms(platforms);
                setAvailableGenres(genres);
                setAvailableThemes(themes);
            } catch (err) {
                console.error('Failed to fetch metadata', err);
            } finally {
                setMetadataLoading(false);
            }
        };
        fetchMetadata();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadGames();
        }, 300);
        return () => clearTimeout(timer);
    }, [page, searchTerm, selectedPlatforms, selectedGenres, selectedThemes, sortBy, ascending]);

    const handleToggle = (list, setList, item) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const filterAndSortTags = (available, selected, searchTerm, isPlatform = false) => {
        let results = [...available];

        // 1. Filter by search term if active
        if (searchTerm.length >= 2) {
            results = results.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else if (isPlatform && !expandPlatforms) {
            // 2. For platforms, if not searching and not expanded, show Popular + Selected
            results = results.filter(item =>
                selected.includes(item.name) || POPULAR_PLATFORMS.includes(item.name)
            );
        }

        // 3. Sort: Selected first, then Popular (for platforms), then Alphabetical
        return results.sort((a, b) => {
            const aSel = selected.includes(a.name);
            const bSel = selected.includes(b.name);
            if (aSel && !bSel) return -1;
            if (!aSel && bSel) return 1;

            if (isPlatform) {
                const aPop = POPULAR_PLATFORMS.includes(a.name);
                const bPop = POPULAR_PLATFORMS.includes(b.name);
                if (aPop && !bPop) return -1;
                if (!aPop && bPop) return 1;
            }

            return a.name.localeCompare(b.name);
        });
    };

    const filteredPlatforms = useMemo(() =>
        filterAndSortTags(availablePlatforms, selectedPlatforms, platformSearch, true),
        [availablePlatforms, selectedPlatforms, platformSearch, expandPlatforms]
    );

    const filteredGenres = useMemo(() =>
        filterAndSortTags(availableGenres, selectedGenres, tagSearch),
        [availableGenres, selectedGenres, tagSearch]
    );

    const filteredThemes = useMemo(() =>
        filterAndSortTags(availableThemes, selectedThemes, tagSearch),
        [availableThemes, selectedThemes, tagSearch]
    );

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-background palette-transition relative">
            {/* Mobile Filters Toggle Button */}
            <div className="lg:hidden p-4 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-40 flex justify-between items-center shadow-sm">
                <button
                    onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                    className="flex items-center gap-2 text-sm font-bold text-text bg-background border border-border px-4 py-2 rounded-dynamic hover:border-accent-500 transition-colors"
                >
                    <Filter size={16} className="text-accent-500" />
                    {isMobileFiltersOpen ? 'HIDE FILTERS' : 'SHOW FILTERS'}
                    {((selectedPlatforms.length + selectedGenres.length + selectedThemes.length) > 0) && (
                        <span className="bg-accent-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                            {selectedPlatforms.length + selectedGenres.length + selectedThemes.length}
                        </span>
                    )}
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden container-archive relative">
                {/* Overlay for mobile sidebar */}
                {isMobileFiltersOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                        onClick={() => setIsMobileFiltersOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside 
                    className={`
                        absolute lg:static inset-y-0 left-0 z-30
                        w-72 sm:w-80 lg:w-72 flex-shrink-0 border-r border-border bg-surface flex flex-col overflow-hidden shadow-2xl lg:shadow-none
                        transform transition-transform duration-300 ease-in-out
                        ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    `}
                >
                    <div className="p-4 border-b border-border bg-surface/50 flex justify-between items-center">
                        <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                            <Filter size={14} /> Refine Search
                        </h2>
                        <button 
                            className="lg:hidden p-1 text-text-muted hover:text-red-500 transition-colors"
                            onClick={() => setIsMobileFiltersOpen(false)}
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="p-4 pb-0 bg-surface/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                            <input
                                type="text"
                                placeholder="Search quest identifier..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-dynamic focus:border-accent-500 outline-none text-sm transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-8 density-pad custom-scrollbar">
                        {/* Platforms */}
                        <section>
                            <h3 className="text-xs font-black text-text-muted uppercase tracking-tighter mb-2 flex justify-between items-center bg-background/50 p-1 px-2 border-l-2 border-accent-500">
                                <span>Platform Matrix</span>
                                <span className="text-[10px] opacity-50">{selectedPlatforms.length > 0 && `[${selectedPlatforms.length} ACTIVE]`}</span>
                            </h3>

                            {/* Filter Search */}
                            <div className="relative mb-3">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted opacity-50" size={12} />
                                <input
                                    type="text"
                                    placeholder="Filter systems..."
                                    value={platformSearch}
                                    onChange={(e) => setPlatformSearch(e.target.value)}
                                    className="w-full pl-7 pr-2 py-1 bg-surface border border-border rounded text-[11px] focus:border-accent-500 outline-none"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 density-gap">
                                {filteredPlatforms.map(p => (
                                    <CategoryTag
                                        key={p.name}
                                        category="platform"
                                        value={p.name}
                                        logoUrl={p.platformLogoUrl}
                                        family={p.platformFamily}
                                        size="sm"
                                        active={selectedPlatforms.includes(p.name)}
                                        onClick={() => handleToggle(selectedPlatforms, setSelectedPlatforms, p.name)}
                                    />
                                ))}
                            </div>

                            {!platformSearch && (
                                <button
                                    onClick={() => setExpandPlatforms(!expandPlatforms)}
                                    className="mt-3 w-full py-1 text-[10px] font-bold text-accent-500 hover:bg-accent-50 border border-transparent hover:border-accent-200 rounded flex items-center justify-center gap-1 transition-all"
                                >
                                    {expandPlatforms ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    {expandPlatforms ? 'COLLAPSE TO POPULAR' : 'EXPAND ALL PLATFORMS'}
                                </button>
                            )}
                        </section>

                        {/* Tag Filters (Combined Genres and Themes) */}
                        <section>
                            <h3 className="text-xs font-black text-text-muted uppercase tracking-tighter mb-2 flex justify-between items-center bg-background/50 p-1 px-2 border-l-2 border-accent-500">
                                <span>Tag Filters</span>
                                <span className="text-[10px] opacity-50">{(selectedGenres.length + selectedThemes.length) > 0 && `[${selectedGenres.length + selectedThemes.length} ACTIVE]`}</span>
                            </h3>

                            <div className="relative mb-3">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted opacity-50" size={12} />
                                <input
                                    type="text"
                                    placeholder="Filter tags..."
                                    value={tagSearch}
                                    onChange={(e) => setTagSearch(e.target.value)}
                                    className="w-full pl-7 pr-2 py-1 bg-surface border border-border rounded text-[11px] focus:border-accent-500 outline-none"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 density-gap">
                                {filteredGenres.map(g => (
                                    <CategoryTag
                                        key={g.name}
                                        category="genre"
                                        value={g.name}
                                        size="sm"
                                        active={selectedGenres.includes(g.name)}
                                        onClick={() => handleToggle(selectedGenres, setSelectedGenres, g.name)}
                                    />
                                ))}
                                {filteredThemes.map(t => (
                                    <CategoryTag
                                        key={t.name}
                                        category="theme"
                                        value={t.name}
                                        size="sm"
                                        active={selectedThemes.includes(t.name)}
                                        onClick={() => handleToggle(selectedThemes, setSelectedThemes, t.name)}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="p-4 border-t border-border bg-surface/50">
                        <button
                            onClick={() => {
                                setSelectedPlatforms([]);
                                setSelectedGenres([]);
                                setSelectedThemes([]);
                                setSearchTerm('');
                                setPage(0);
                            }}
                            className="w-full py-2 border border-dashed border-border text-xs font-bold text-text-muted hover:text-red-500 hover:border-red-200 transition-all flex items-center justify-center gap-2 rounded-dynamic"
                        >
                            <X size={14} /> PURGE ALL FILTERS
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-background/20 relative custom-scrollbar">
                    {/* Header bar */}
                    <div className="sticky top-0 z-10 p-4 bg-background/80 backdrop-blur-md border-b border-border flex justify-between items-center">
                        <div className="flex items-center gap-2 sm:gap-6">
                            <div className="flex items-center gap-2 text-text-muted text-xs font-bold tracking-widest">
                                <LayoutGrid size={14} className="min-w-max" />
                                <span className="truncate">ARCHIVE // {loading ? 'SCANNING...' : `FOUND_${totalFound}`}</span>
                            </div>

                            <div className="h-6 w-px bg-border hidden sm:block"></div>

                            <div className="hidden sm:flex items-center gap-2 lg:gap-3">
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-tighter hidden md:inline">Sort Sequence:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-surface border border-border px-3 py-1 rounded-dynamic text-[11px] font-bold outline-none focus:border-accent-500 shadow-sm"
                                >
                                    <option value="total_rating">IGDB Global Rating</option>
                                    <option value="community_rating">Community Rating</option>
                                    <option value="name">Alpha Sequence [A-Z]</option>
                                    <option value="release_date">Release Timeline</option>
                                </select>
                                <button
                                    onClick={() => setAscending(!ascending)}
                                    className="p-1.5 hover:bg-surface rounded border border-border text-text-muted transition-colors flex items-center justify-center"
                                    title={ascending ? "Ascending" : "Descending"}
                                >
                                    {ascending ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-2 items-center flex-wrap">
                            {[...selectedPlatforms.map(p => ({ category: 'platform', value: p })),
                            ...selectedGenres.map(g => ({ category: 'genre', value: g })),
                            ...selectedThemes.map(t => ({ category: 'theme', value: t }))].slice(0, 5).map(item => (
                                <div key={item.value} className="relative group/tag">
                                    <CategoryTag
                                        category={item.category}
                                        value={item.value}
                                        size="sm"
                                    />
                                    <button
                                        onClick={() => {
                                            if (item.category === 'platform') handleToggle(selectedPlatforms, setSelectedPlatforms, item.value);
                                            else if (item.category === 'genre') handleToggle(selectedGenres, setSelectedGenres, item.value);
                                            else if (item.category === 'theme') handleToggle(selectedThemes, setSelectedThemes, item.value);
                                        }}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/tag:opacity-100 transition-opacity shadow-sm hover:scale-110"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                            {([...selectedPlatforms, ...selectedGenres, ...selectedThemes].length > 5) && (
                                <span className="text-[10px] font-bold text-text-muted px-2 py-0.5">
                                    +{[...selectedPlatforms, ...selectedGenres, ...selectedThemes].length - 5} MORE
                                </span>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-accent-500 opacity-50">
                            <Loader2 className="animate-spin" size={48} />
                            <span className="font-display font-bold text-sm tracking-tighter">SYNCHRONIZING_DATA...</span>
                        </div>
                    ) : (
                        <div className="p-6 density-pad">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 sm:gap-10 density-gap">
                                {games.map((game, idx) => (
                                    <div key={game.igdbId} className="animate-fade-in" style={{ animationDelay: `${idx * 20}ms` }}>
                                        <GameCard game={game} />
                                    </div>
                                ))}
                            </div>

                            {games.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-text-muted border-2 border-dashed border-border rounded-dynamic m-4">
                                    <X size={48} className="mb-4 opacity-20" />
                                    <p className="font-display font-bold text-lg uppercase tracking-widest italic">No Data Nodes Found</p>
                                    <button
                                        onClick={() => { setSearchTerm(''); setSelectedPlatforms([]); setSelectedGenres([]); setPage(0); }}
                                        className="mt-4 px-6 py-2 bg-accent-500 text-white font-bold rounded-dynamic shadow-retro hover:bg-accent-600 transition-all"
                                    >
                                        REBOOT SEARCH
                                    </button>
                                </div>
                            )}

                            {/* Pagination Controls */}
                            {games.length > 0 && (
                                <div className="flex flex-col-reverse sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-8 pb-8">
                                    <div className="flex justify-between w-full sm:w-auto gap-4">
                                        <button
                                            disabled={page === 0 || loading}
                                            onClick={() => setPage(p => Math.max(0, p - 1))}
                                            className="w-full sm:w-auto px-4 py-2 bg-surface terminal-border rounded-dynamic-btn disabled:opacity-50 hover:bg-accent-50 text-text-muted hover:text-accent-600 transition-colors font-bold tracking-widest text-xs"
                                        >
                                            <span className="sm:hidden">&lt; PREV</span>
                                            <span className="hidden sm:inline">&lt; PREVIOUS_PAGE</span>
                                        </button>
                                        <button
                                            disabled={!hasNextPage || loading}
                                            onClick={() => setPage(p => p + 1)}
                                            className="w-full sm:w-auto px-4 py-2 bg-surface terminal-border rounded-dynamic-btn disabled:opacity-50 hover:bg-accent-50 text-text-muted hover:text-accent-600 transition-colors font-bold tracking-widest text-xs"
                                        >
                                            <span className="sm:hidden">NEXT &gt;</span>
                                            <span className="hidden sm:inline">NEXT_PAGE &gt;</span>
                                        </button>
                                    </div>
                                    <span className="text-text-muted font-bold tracking-widest text-xs mb-2 sm:mb-0">
                                        [ PAGE {page + 1} OF {Math.ceil(totalFound / PAGE_SIZE) || 1} ]
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Visual Scanline Effect */}
            <div className="scanlines-overlay" />
        </div>
    );
};

export default BrowsePage;
