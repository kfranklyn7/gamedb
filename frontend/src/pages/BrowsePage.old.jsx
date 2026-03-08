import React, { useState, useEffect } from 'react';
import { gamesApi } from '../api/games';
import GameCard from '../components/GameCard';
import SearchBar from '../components/SearchBar';
import { Loader2 } from 'lucide-react';

const BrowsePage = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchActive, setSearchActive] = useState(false);

    // Search state
    const [searchTerm, setSearchTerm] = useState('');

    const loadGames = async (pageNum = 0) => {
        setLoading(true);
        try {
            if (searchActive && searchTerm.trim() !== '') {
                // Use advanced search (returns List<Game> without pagination structurally in backend currently)
                // Since backend searchGames returns List<Game> and not Page<Game>, we will simulate paginated or just show all for now.
                const results = await gamesApi.searchAdvanced({ searchTerm });
                setGames(results);
                setTotalPages(1); // No pagination supported on search yet in backend DTO response
            } else {
                // Standard paginated fetch
                const response = await gamesApi.getGames({ page: pageNum, size: 24, sortBy: 'total_rating', ascending: false });
                setGames(response.content || []);
                setTotalPages(response.page?.totalPages || response.totalPages || 0);
            }
        } catch (err) {
            console.error('Failed to load games', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGames(page);
    }, [page, searchActive, searchTerm]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        setSearchActive(term.trim() !== '');
        setPage(0); // Reset page on new search
    };

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="text-center pt-8 pb-4">
                <h1 className="text-4xl sm:text-5xl font-display font-bold text-text mb-4">Discover Quests</h1>
                <p className="text-lg text-text-muted mb-8 max-w-2xl mx-auto">
                    Browse top-rated games or search for your next adventure.
                </p>
                <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-accent-500" size={48} />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                        {games.map(game => (
                            <GameCard key={game.igdbId} game={game} />
                        ))}
                    </div>

                    {games.length === 0 && (
                        <div className="text-center py-20 text-text-muted bg-surface rounded-2xl border border-dashed border-border">
                            <p className="text-lg font-medium">No quests found matching your criteria.</p>
                        </div>
                    )}

                    {!searchActive && totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8 pb-8">
                            <button
                                disabled={page === 0}
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                className="px-4 py-2 bg-surface border border-border rounded-lg disabled:opacity-50 hover:bg-accent-50 hover:text-accent-600 transition-colors font-medium"
                            >
                                Previous
                            </button>
                            <span className="text-text-muted font-medium">
                                Page {page + 1} of {totalPages}
                            </span>
                            <button
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 bg-surface border border-border rounded-lg disabled:opacity-50 hover:bg-accent-50 hover:text-accent-600 transition-colors font-medium"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default BrowsePage;
