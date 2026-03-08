import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getParsedCover } from '../utils/imageUtils';
import { gamesApi } from '../api/games';
import { userListApi } from '../api/userList';
import { useAuth } from '../context/AuthContext';
import ScoreBox from '../components/ScoreBox';
import CategoryTag from '../components/CategoryTag';
import IgdbLink from '../components/IgdbLink';
import QuestModal from '../components/QuestModal';
import { Loader2, Calendar, CheckSquare } from 'lucide-react';

const GameDetailPage = () => {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();

    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionSuccess, setActionSuccess] = useState(false);

    useEffect(() => {
        const loadGame = async () => {
            try {
                const data = await gamesApi.getGameById(id);
                console.log('API RESOLVED GAME DATA:', data);
                setGame(data);
            } catch (err) {
                console.error('Failed to load game details', err);
            } finally {
                setLoading(false);
            }
        };
        loadGame();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="animate-spin text-accent-500" size={48} />
            </div>
        );
    }

    if (!game) {
        return (
            <div className="text-center py-20 bg-surface rounded-2xl border border-dashed border-border mt-10">
                <h2 className="text-2xl font-bold text-text">Quest Not Found</h2>
                <p className="text-text-muted mt-2">The game you are looking for doesn't exist in our archives.</p>
            </div>
        );
    }

    const handleAddToList = async ({ status, personalRating, review, replayCount, startedAt, completedAt, priority }) => {
        setActionLoading(true);
        setActionSuccess(false);
        try {
            await userListApi.addItem({ gameId: game.igdbId, status, personalRating, review, replayCount, startedAt, completedAt, priority });
            setModalOpen(false);
            setActionSuccess(true);
            setTimeout(() => setActionSuccess(false), 3000);
        } catch (err) {
            console.error('Add to list failed', err);
            if (err.response?.status === 409) {
                try {
                    await userListApi.updateItem(game.igdbId, { status, personalRating, review, replayCount, startedAt, completedAt, priority });
                    setModalOpen(false);
                    setActionSuccess(true);
                    setTimeout(() => setActionSuccess(false), 3000);
                } catch (updateErr) {
                    console.error('Update also failed', updateErr);
                    alert('Failed to update game in your list.');
                }
            } else {
                alert(err.response?.data?.message || 'Failed to add game to your list.');
            }
        } finally {
            setActionLoading(false);
        }
    };

    const coverUrl = getParsedCover(game.cover);
    const year = game.releaseDate ? new Date(game.releaseDate).getFullYear() : 'TBA';

    return (
        <div className="animate-fade-in relative">

            {/* Toast Notification */}
            {actionSuccess && (
                <div className="fixed bottom-6 right-6 z-50 bg-green-50 text-green-700 border border-green-200 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-slide-up">
                    <CheckSquare size={20} />
                    <span className="font-medium">Quest successfully added to your journal!</span>
                </div>
            )}

            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-border shadow-xl">
                <div className="absolute inset-0">
                    <img src={coverUrl} alt="Background" className="w-full h-full object-cover opacity-20 blur-xl scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                </div>

                <div className="relative p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-start md:items-end">
                    <img
                        src={coverUrl}
                        alt={game.name}
                        className="w-48 sm:w-64 aspect-[3/4] object-cover rounded-xl shadow-2xl border-2 border-white/10"
                    />

                    <div className="flex-grow flex flex-col items-start gap-4">
                        <div className="flex flex-wrap gap-2 text-white/80 font-medium text-sm">
                            <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                                <Calendar size={14} /> {year}
                            </span>
                            {(game.developers || []).length > 0 && (
                                <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                                    {(game.developers || []).map(d => typeof d === 'object' ? d.name : d).join(', ')}
                                </span>
                            )}
                            {(game.publishers || []).length > 0 && (
                                <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                                    📢 {(game.publishers || []).map(p => typeof p === 'object' ? p.name : p).join(', ')}
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white leading-tight">
                            {game.name}
                        </h1>

                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                            {/* Score boxes */}
                            <ScoreBox
                                type="community"
                                score={game.total_rating}
                                voteCount={game.total_rating_count}
                                size="lg"
                            />

                            {isAuthenticated ? (
                                <button
                                    onClick={() => setModalOpen(true)}
                                    disabled={actionLoading}
                                    className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-display font-bold tracking-wide rounded-xl shadow-lg hover:shadow-accent-500/25 hover:-translate-y-0.5 transition-all"
                                >
                                    Accept Quest
                                </button>
                            ) : (
                                <div className="px-6 py-3 bg-white/10 text-white/60 font-medium rounded-xl border border-white/10 backdrop-blur-sm">
                                    Log in to track this game
                                </div>
                            )}

                            {/* IGDB Link */}
                            <IgdbLink url={game.url} slug={game.slug} variant="button" size="sm" />

                            {/* Websites */}
                            {game.websites?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2 pl-2">
                                    {game.websites.filter(Boolean).slice(0, 3).map((url, i) => {
                                        let label = "Website";
                                        if (url.includes("wikipedia")) label = "Wikipedia";
                                        else if (url.includes("steampowered")) label = "Steam";
                                        else if (url.includes("fandom")) label = "Wiki";
                                        else if (url.includes("epicgames")) label = "Epic";
                                        else if (url.includes("gog.com")) label = "GOG";
                                        else if (url.includes("reddit.com")) label = "Reddit";
                                        else if (url.includes("discord.gg")) label = "Discord";

                                        return (
                                            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm underline underline-offset-2">
                                                {label}
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-10">
                    <section>
                        <h3 className="text-2xl font-display font-bold text-text mb-4">Synopsis</h3>
                        <p className="text-lg text-text leading-relaxed bg-surface p-6 rounded-2xl border border-border shadow-sm">
                            {game.summary || 'No summary available.'}
                        </p>
                    </section>

                    {game.storyline && (
                        <section>
                            <h3 className="text-2xl font-display font-bold text-text mb-4">Storyline</h3>
                            <p className="text-lg text-text-muted leading-relaxed italic border-l-4 border-accent-400 pl-6 py-2">
                                "{game.storyline}"
                            </p>
                        </section>
                    )}

                    {/* Media */}
                    {((game.videos || []).length > 0 || (game.screenshots || []).length > 0 || (game.artworks || []).length > 0) && (
                        <section>
                            <h3 className="text-2xl font-display font-bold text-text mb-4">Media</h3>
                            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                                {(game.videos || []).filter(Boolean).map(vid => {
                                    const vidId = typeof vid === 'object' ? vid.video_id || vid.videoId : vid;
                                    return (
                                        <iframe
                                            key={vidId}
                                            className="w-72 md:w-80 aspect-video rounded-xl flex-shrink-0 bg-black/50 border border-border shadow-sm"
                                            src={`https://www.youtube.com/embed/${vidId}`}
                                            title="YouTube video player"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    );
                                })}
                                {(game.screenshots || []).filter(Boolean).map((img, i) => {
                                    const imgId = typeof img === 'object' ? img.image_id || img.imageId : img;
                                    return (
                                        <img
                                            key={imgId || i}
                                            src={`https://images.igdb.com/igdb/image/upload/t_screenshot_med/${imgId}.jpg`}
                                            alt="Screenshot"
                                            className="h-40 md:h-44 object-cover rounded-xl flex-shrink-0 border border-border shadow-sm"
                                        />
                                    );
                                })}
                                {(game.artworks || []).filter(Boolean).map((img, i) => {
                                    const imgId = typeof img === 'object' ? img.image_id || img.imageId : img;
                                    return (
                                        <img
                                            key={imgId || i}
                                            src={`https://images.igdb.com/igdb/image/upload/t_screenshot_med/${imgId}.jpg`}
                                            alt="Artwork"
                                            className="h-40 md:h-44 object-cover rounded-xl flex-shrink-0 border border-border shadow-sm"
                                        />
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Related Games Ecosystem */}
                    {[
                        { title: 'DLCs & Addons', data: game.dlcsData || game.dlcs },
                        { title: 'Expansions', data: game.expansionsData || game.expansions },
                        { title: 'Remakes', data: game.remakesData || game.remakes },
                        { title: 'Remasters', data: game.remastersData || game.remasters },
                        { title: 'Similar Games', data: game.similarGamesData || game.similarGames }
                    ].map(({ title, data }, sectionIndex) => {
                        if (!data || data.length === 0) return null;
                        
                        return (
                            <section key={sectionIndex}>
                                <h3 className="text-2xl font-display font-bold text-text mb-4">{title}</h3>
                                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                                    {data.filter(Boolean).map((sg, i) => {
                                        // Handle cases where sg might just be an ID instead of an object
                                        if (typeof sg !== 'object') return null;

                                        // Extract cover gracefully 
                                        const coverUrl = sg.cover ? getParsedCover(sg.cover) : null;
                                        const gameId = sg.igdbId || sg.id;
                                        const gameName = sg.name || 'Unknown Game';

                                        if (!gameId) return null;

                                        return (
                                            <Link key={`${gameId}-${i}`} to={`/game/${gameId}`} className="group relative block w-32 sm:w-40 aspect-[3/4] rounded-xl overflow-hidden bg-surface border border-border shadow-sm flex-shrink-0 snap-start">
                                                {coverUrl ? (
                                                    <img
                                                        src={coverUrl}
                                                        alt={gameName}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center p-4 text-center bg-surface-hover">
                                                        <span className="font-bold text-xs text-text-muted">{gameName}</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2 pt-6">
                                                    <span className="text-white font-bold text-xs leading-tight truncate block">{gameName}</span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </div>

                <div className="space-y-6">
                    {/* Platforms — CategoryTag pills */}
                    {game.platforms?.length > 0 && (
                        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
                            <h4 className="font-bold text-text uppercase tracking-wider text-xs mb-3">Platforms</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {game.platforms.map((p, idx) => {
                                    const val = typeof p === 'object' && p !== null ? p.name || p.value : p;
                                    const key = typeof p === 'object' && p !== null ? p.igdbId || p.id || val : p;
                                    return <CategoryTag key={key || idx} category="platform" value={val} size="sm" />;
                                })}
                            </div>
                        </div>
                    )}

                    {/* Genres — CategoryTag pills */}
                    {(game.genreNames || game.genres)?.length > 0 && (
                        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
                            <h4 className="font-bold text-text uppercase tracking-wider text-xs mb-3">Genres</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {(game.genreNames || game.genres).map((g, idx) => {
                                    const val = typeof g === 'object' && g !== null ? g.name || g.value : g;
                                    const key = typeof g === 'object' && g !== null ? g.igdbId || g.id || val : g;
                                    return <CategoryTag key={key || idx} category="genre" value={val} size="sm" />;
                                })}
                            </div>
                        </div>
                    )}

                    {/* Themes — CategoryTag pills */}
                    {(game.themes || game.themeNames)?.length > 0 && (
                        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
                            <h4 className="font-bold text-text uppercase tracking-wider text-xs mb-3">Themes</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {(game.themes || game.themeNames).map((t, idx) => {
                                    const val = typeof t === 'object' && t !== null ? t.name || t.value : t;
                                    const key = typeof t === 'object' && t !== null ? t.igdbId || t.id || val : t;
                                    return <CategoryTag key={key || idx} category="theme" value={val} size="sm" />;
                                })}
                            </div>
                        </div>
                    )}

                    {/* Game Modes — CategoryTag pills */}
                    {game.gameModes?.length > 0 && (
                        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
                            <h4 className="font-bold text-text uppercase tracking-wider text-xs mb-3">Game Modes</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {game.gameModes.map((m, idx) => {
                                    const val = typeof m === 'object' && m !== null ? m.name || m.value : m;
                                    const key = typeof m === 'object' && m !== null ? m.igdbId || m.id || val : m;
                                    return <CategoryTag key={key || idx} category="gameMode" value={val} size="sm" />;
                                })}
                            </div>
                        </div>
                    )}

                    {/* Player Perspectives — CategoryTag pills */}
                    {game.playerPerspectives?.length > 0 && (
                        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
                            <h4 className="font-bold text-text uppercase tracking-wider text-xs mb-3">Player Perspectives</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {game.playerPerspectives.filter(Boolean).map((p, idx) => {
                                    const val = typeof p === 'object' && p !== null ? p.name || p.value : p;
                                    const key = typeof p === 'object' && p !== null ? p.igdbId || p.id || val : p;
                                    return <CategoryTag key={key || idx} category="theme" value={val} size="sm" />;
                                })}
                            </div>
                        </div>
                    )}

                    {/* Game Engines — CategoryTag pills */}
                    {(game.gameEngines || game.game_engines)?.length > 0 && (
                        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
                            <h4 className="font-bold text-text uppercase tracking-wider text-xs mb-3">Engine</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {(game.gameEngines || game.game_engines).filter(Boolean).map((e, idx) => {
                                    const val = typeof e === 'object' && e !== null ? e.name || e.value : e;
                                    const key = typeof e === 'object' && e !== null ? e.igdbId || e.id || val : e;
                                    return <CategoryTag key={key || idx} category="developer" value={val} size="sm" />;
                                })}
                            </div>
                        </div>
                    )}


                    {/* Keywords — CategoryTag pills */}
                    {(game.keywordNames || game.keywords)?.length > 0 && (
                        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
                            <h4 className="font-bold text-text uppercase tracking-wider text-xs mb-3">Keywords</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {(game.keywordNames || game.keywords).slice(0, 10).map((k, idx) => {
                                    const val = typeof k === 'object' && k !== null ? k.name || k.value : k;
                                    const key = typeof k === 'object' && k !== null ? k.igdbId || k.id || val : k;
                                    return <CategoryTag key={key || idx} category="keyword" value={val} size="sm" />;
                                })}
                                {(game.keywordNames || game.keywords).length > 10 && (
                                    <span className="text-[11px] font-bold text-text-muted px-2 py-0.5 rounded border border-dashed border-border bg-background">
                                        +{(game.keywordNames || game.keywords).length - 10} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <QuestModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleAddToList}
                title={`Accept Quest: ${game.name}`}
            />
        </div>
    );
};

export default GameDetailPage;
