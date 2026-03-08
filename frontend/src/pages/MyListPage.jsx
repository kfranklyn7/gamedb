import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { userListApi } from '../api/userList';
import ChipCard from '../components/ChipCard';
import CartridgeCard from '../components/CartridgeCard';
import CaseCard from '../components/CaseCard';
import SortFilterBar from '../components/SortFilterBar';
import Shelf from '../components/Shelf';
import QuestModal from '../components/QuestModal';
import { STATUS_CONFIG } from '../components/StatusBadge';
import { BookOpen, Loader2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyListPage = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');

    // View, Sort, Filter state
    const [activeView, setActiveView] = useState(() =>
        localStorage.getItem('questlog-view') || 'cartridge'
    );
    const [sortBy, setSortBy] = useState('name-asc');
    const [activeFilters, setActiveFilters] = useState({ genre: [], platform: [], theme: [] });

    // Edit Modal State
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Persist view preference
    useEffect(() => {
        localStorage.setItem('questlog-view', activeView);
    }, [activeView]);

    const loadList = async () => {
        setLoading(true);
        try {
            const data = await userListApi.getList();
            setList(data.items || data || []);
        } catch (err) {
            console.error('Failed to load quest journal', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadList();
    }, []);

    const handleEditClick = (item) => {
        setEditingItem(item);
        setModalOpen(true);
    };

    const handleDelete = async (gameId) => {
        if (window.confirm('Are you sure you want to abandon this quest?')) {
            try {
                await userListApi.removeItem(gameId);
                setList(prev => prev.filter(item => item.game.igdbId !== gameId));
            } catch (err) {
                console.error('Failed to delete', err);
                alert('Failed to remove quest.');
            }
        }
    };

    const handleModalSubmit = async ({ status, personalRating, review, replayCount, startedAt, completedAt, priority }) => {
        if (!editingItem) return;
        try {
            await userListApi.updateItem(editingItem.game.igdbId, {
                status, personalRating, review, replayCount, startedAt, completedAt, priority
            });
            setModalOpen(false);
            setEditingItem(null);
            loadList();
        } catch (err) {
            console.error('Failed to update quest', err);
            alert('Failed to update quest entry.');
        }
    };

    // ── Filter toggle logic ────────────────────────────
    const handleFilterToggle = useCallback((category, value) => {
        setActiveFilters(prev => {
            const current = prev[category] || [];
            const next = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [category]: next };
        });
    }, []);

    const handleClearFilters = useCallback(() => {
        setActiveFilters({ genre: [], platform: [], theme: [] });
    }, []);

    // ── Tabs ──────────────────────────────────────────
    const tabs = [
        { id: 'ALL', label: 'All Quests' },
        ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ id: k, label: v.label }))
    ];

    // ── Derived: tab-filtered list ───────────────────
    const tabFiltered = useMemo(() => {
        return activeTab === 'ALL' ? list : list.filter(item => item.status === activeTab);
    }, [list, activeTab]);

    // ── Available filters (built from tab-filtered items) ──
    const availableFilters = useMemo(() => {
        const genres = new Set();
        const platforms = new Set();
        const themes = new Set();

        tabFiltered.forEach(item => {
            const gameGenres = item.game.genreNames || item.game.genres || [];
            const gamePlatforms = item.game.platforms || item.game.platformNames || [];
            const gameThemes = item.game.themeNames || item.game.themes || [];

            gameGenres.filter(Boolean).forEach(g => genres.add(typeof g === 'object' ? g.name || g.value : g));
            gamePlatforms.filter(Boolean).forEach(p => platforms.add(typeof p === 'object' ? p.name || p.value : p));
            gameThemes.filter(Boolean).forEach(t => themes.add(typeof t === 'object' ? t.name || t.value : t));
        });

        return {
            genre: [...genres].sort(),
            platform: [...platforms].sort(),
            theme: [...themes].sort(),
        };
    }, [tabFiltered]);

    // ── Apply filters ────────────────────────────────
    const filtered = useMemo(() => {
        return tabFiltered.filter(item => {
            const g = item.game;
            // Helper to get string value
            const getStr = (v) => typeof v === 'object' && v !== null ? v.name || v.value : v;

            // Genres: OR within category
            if (activeFilters.genre.length > 0) {
                const genresArr = g.genreNames || g.genres || [];
                if (!genresArr.some(gn => activeFilters.genre.includes(getStr(gn)))) return false;
            }
            // Platforms: OR within category
            if (activeFilters.platform.length > 0) {
                const platformsArr = g.platforms || g.platformNames || [];
                if (!platformsArr.some(p => activeFilters.platform.includes(getStr(p)))) return false;
            }
            // Themes: OR within category
            if (activeFilters.theme.length > 0) {
                const themesArr = g.themeNames || g.themes || [];
                if (!themesArr.some(t => activeFilters.theme.includes(getStr(t)))) return false;
            }
            return true;
        });
    }, [tabFiltered, activeFilters]);

    // ── Sort ──────────────────────────────────────────
    const sorted = useMemo(() => {
        const items = [...filtered];
        const [field, dir] = sortBy.split('-');
        const mult = dir === 'desc' ? -1 : 1;

        items.sort((a, b) => {
            switch (field) {
                case 'name':
                    return mult * (a.game.name || '').localeCompare(b.game.name || '');
                case 'rating':
                    return mult * ((a.game.total_rating || 0) - (b.game.total_rating || 0));
                case 'personal':
                    return mult * ((a.personalRating || 0) - (b.personalRating || 0));
                case 'updated':
                    return mult * (new Date(a.lastUpdated || 0) - new Date(b.lastUpdated || 0));
                case 'priority': {
                    const pOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
                    return mult * ((pOrder[a.priority] || 0) - (pOrder[b.priority] || 0));
                }
                default:
                    return 0;
            }
        });
        return items;
    }, [filtered, sortBy]);

    // ── Responsive: hide Case on mobile ──────────────
    const showCase = typeof window !== 'undefined' && window.innerWidth > 1024;

    // ── Render cards based on active view ─────────────
    const renderCards = () => {
        if (sorted.length === 0) return null;

        switch (activeView) {
            case 'chip':
                return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {sorted.map(item => (
                            <ChipCard key={item.game.igdbId} listItem={item} />
                        ))}
                    </div>
                );
            case 'case':
                return (
                    <div className="flex flex-col gap-4">
                        {sorted.map(item => (
                            <CaseCard
                                key={item.game.igdbId}
                                listItem={item}
                                onEdit={handleEditClick}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                );
            case 'cartridge':
            default:
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {sorted.map(item => (
                            <CartridgeCard
                                key={item.game.igdbId}
                                listItem={item}
                                onEdit={handleEditClick}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <Loader2 className="animate-spin text-accent-500" size={48} />
            </div>
        );
    }

    return (
        <div className="animate-fade-in pb-12">
            <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-surface rounded-2xl shadow-sm border border-border mb-6">
                    <BookOpen size={40} className="text-accent-500" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-display font-bold text-text mb-4">Quest Journal</h1>
                <p className="text-text-muted text-lg max-w-2xl mx-auto">
                    Your personal chronicle of games played, playing, and planned.
                </p>
            </div>

            {list.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 bg-surface rounded-3xl border border-dashed border-border shadow-sm text-center">
                    <BookOpen strokeWidth={1} size={64} className="text-text-muted/30 mb-6" />
                    <h2 className="text-2xl font-bold text-text mb-2">Your journal is empty</h2>
                    <p className="text-text-muted mb-8 text-lg">Every epic journey begins with a single quest.</p>
                    <Link to="/" className="px-8 py-3 bg-accent-500 text-white font-bold font-display tracking-wide rounded-xl shadow-md hover:bg-accent-600 transition-colors">
                        Find Quests
                    </Link>
                </div>
            ) : (
                <>
                    {/* Chapter Tabs — notebook divider style */}
                    <div className="flex overflow-x-auto hide-scrollbar gap-1 mb-6 pb-1">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            const statusConf = STATUS_CONFIG[tab.id];
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex-shrink-0 px-4 py-2.5 font-medium text-sm
                                        rounded-t-xl transition-all duration-200
                                        ${isActive
                                            ? `${statusConf?.colorBg || 'bg-accent-50 dark:bg-accent-950/30'}
                                               ${statusConf?.colorText || 'text-accent-700 dark:text-accent-400'}
                                               shadow-md z-10 relative font-semibold`
                                            : `${statusConf?.colorBg || 'bg-accent-50 dark:bg-accent-950/30'}
                                               ${statusConf?.colorText || 'text-accent-700 dark:text-accent-400'}
                                               opacity-50 hover:opacity-80`
                                        }
                                    `}
                                >
                                    {tab.label}
                                    {isActive && (
                                        <span className="ml-2 text-xs opacity-70">
                                            ({sorted.length})
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Removed jarring divider line */}
                    <div className="mb-6"></div>

                    {/* Sort / Filter / View toolbar */}
                    <SortFilterBar
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        availableFilters={availableFilters}
                        activeFilters={activeFilters}
                        onFilterToggle={handleFilterToggle}
                        onClearFilters={handleClearFilters}
                        activeView={activeView}
                        onViewChange={setActiveView}
                        showCase={showCase}
                    />

                    {/* Game cards */}
                    <Shelf
                        title={tabs.find(t => t.id === activeTab)?.label}
                        count={sorted.length}
                        emptyMessage="No quests match your filters."
                    >
                        {renderCards()}
                    </Shelf>
                </>
            )}

            {editingItem && (
                <QuestModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setEditingItem(null);
                    }}
                    onSubmit={handleModalSubmit}
                    initialStatus={editingItem.status}
                    initialRating={editingItem.personalRating}
                    initialReview={editingItem.review}
                    initialReplayCount={editingItem.replayCount}
                    initialStartedAt={editingItem.startedAt}
                    initialCompletedAt={editingItem.completedAt}
                    initialPriority={editingItem.priority}
                    title={`Update Quest: ${editingItem.game.name}`}
                />
            )}
        </div>
    );
};

export default MyListPage;
