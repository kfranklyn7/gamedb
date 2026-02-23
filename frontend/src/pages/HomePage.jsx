import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userListApi } from '../api/userList';
import ChipCard from '../components/ChipCard';
import { useAuth } from '../context/AuthContext';
import { Loader2, PlayCircle, ListTodo, Trophy, Star, ChevronRight } from 'lucide-react';

const Shelf = ({ title, icon: Icon, items, emptyMessage, viewAllStatus }) => {
    if (!items || items.length === 0) {
        return (
            <section className="mt-12">
                <div className="flex items-center gap-2 mb-4">
                    <Icon className="text-accent-500" size={24} />
                    <h2 className="text-2xl font-display font-bold text-text">{title}</h2>
                </div>
                <div className="bg-surface border border-dashed border-border rounded-2xl p-8 text-center text-text-muted">
                    <p>{emptyMessage}</p>
                    <Link to="/browse" className="text-accent-500 hover:text-accent-600 font-medium inline-block mt-2">
                        Discover games to add
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="mt-12 mb-8">
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <Icon className="text-accent-500" size={24} />
                    <h2 className="text-2xl font-display font-bold text-text">{title}</h2>
                </div>
                {viewAllStatus && (
                    <Link
                        to="/my-list"
                        state={{ initialFilter: viewAllStatus }}
                        className="text-sm font-medium text-text-muted hover:text-accent-500 flex items-center gap-1 group transition-colors"
                    >
                        View All
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                )}
            </div>

            <div className="relative pt-6 pb-2">
                {/* Fade edges for horizontal scroll indication */}
                <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none"></div>
                <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none"></div>

                {/* Games scrolling container */}
                <div className="flex gap-4 sm:gap-6 overflow-x-auto px-4 pb-1 pt-2 snap-x snap-mandatory hide-scrollbar relative z-10 items-end">
                    {items.map(item => (
                        <div key={item.id || item.game.igdbId} className="w-40 sm:w-48 shrink-0 snap-start self-end origin-bottom">
                            <div className="drop-shadow-[0_12px_12px_rgba(0,0,0,0.5)] dark:drop-shadow-[0_12px_12px_rgba(0,0,0,0.8)] relative z-10 transition-transform duration-300 hover:-translate-y-2">
                                <ChipCard listItem={item} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Physical Wooden/Metal Shelf (Absolute positioned at the bottom) */}
                <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none">
                    {/* Shelf Top Surface (Perspective trick) */}
                    <div className="h-8 mx-1 bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-t-sm shadow-inner opacity-80"
                        style={{ transform: 'perspective(250px) rotateX(15deg)', transformOrigin: 'bottom' }}>
                    </div>
                    {/* Shelf Front Lip */}
                    <div className="h-4 bg-slate-400 dark:bg-slate-900 rounded-b shadow-[0_4px_16px_rgba(0,0,0,0.3)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.7)] border-t border-slate-300 dark:border-slate-700 relative z-10">
                        {/* Highlights & Details */}
                        <div className="absolute top-0 inset-x-0 h-px bg-white/40 dark:bg-white/10"></div>
                        <div className="absolute bottom-0 inset-x-0 h-px bg-black/20 dark:bg-black/50"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const HomePage = () => {
    const { user } = useAuth();
    const [listItems, setListItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const data = await userListApi.getList();
                // userListApi.getList() returns an object with 'items' array
                setListItems(data?.items || []);
            } catch (error) {
                console.error('Failed to fetch user list for homepage:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchList();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="animate-spin text-accent-500" size={48} />
            </div>
        );
    }

    // --- Derive Shelves ---

    // 1. Currently Playing
    const playing = listItems
        .filter(item => item.status === 'PLAYING')
        .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

    // 2. Up Next (Plan to Play, prioritized by 'HIGH' priority, then recently added)
    const upNext = listItems
        .filter(item => item.status === 'PLAN_TO_PLAY')
        .sort((a, b) => {
            if (a.priority === 'HIGH' && b.priority !== 'HIGH') return -1;
            if (a.priority !== 'HIGH' && b.priority === 'HIGH') return 1;
            return new Date(b.addedAt || 0) - new Date(a.addedAt || 0);
        });

    // 3. Recently Completed
    const recentlyCompleted = listItems
        .filter(item => item.status === 'COMPLETED')
        .sort((a, b) => {
            // Sort by completedAt if available, otherwise fallback to updatedAt
            const dateA = a.completedAt ? new Date(a.completedAt) : new Date(a.updatedAt || 0);
            const dateB = b.completedAt ? new Date(b.completedAt) : new Date(b.updatedAt || 0);
            return dateB - dateA;
        })
        .slice(0, 10); // Limit horizontal scroll

    // 4. Favorites (Top Rated)
    const favorites = listItems
        .filter(item => item.personalRating >= 8)
        .sort((a, b) => b.personalRating - a.personalRating);

    return (
        <div className="animate-fade-in pb-12">
            <header className="py-8 text-center sm:text-left">
                <h1 className="text-4xl sm:text-5xl font-display font-bold text-text">
                    Welcome back, <span className="text-accent-500">{user?.username || 'Player'}</span>!
                </h1>
                <p className="text-lg text-text-muted mt-2">
                    Here's an overview of your active quests and recent milestones.
                </p>
            </header>

            <div className="space-y-4">
                <Shelf
                    title="Currently Playing"
                    icon={PlayCircle}
                    items={playing}
                    emptyMessage="You aren't playing anything right now."
                    viewAllStatus="PLAYING"
                />

                <Shelf
                    title="Up Next"
                    icon={ListTodo}
                    items={upNext}
                    emptyMessage="Your backlog is empty!"
                    viewAllStatus="PLAN_TO_PLAY"
                />

                <Shelf
                    title="Recently Completed"
                    icon={Trophy}
                    items={recentlyCompleted}
                    emptyMessage="You haven't completed any quests yet."
                    viewAllStatus="COMPLETED"
                />

                <Shelf
                    title="Favorites"
                    icon={Star}
                    items={favorites}
                    emptyMessage="Rate games 8+ to see them on this shelf."
                    viewAllStatus={null}
                />
            </div>
        </div>
    );
};

export default HomePage;
