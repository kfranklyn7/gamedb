import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userListApi } from '../api/userList';
import { getParsedCover } from '../utils/imageUtils';
import { Loader2, UserCircle, Target, Award, Play, CheckCircle2, Palette, Check, Star } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const UserProfilePage = () => {
    const { username } = useParams();
    const { user: currentUser } = useAuth();
    const { palette, setPalette } = useTheme();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const isOwnProfile = currentUser?.username === username;

    const palettes = [
        { id: 'indigo', name: 'Indigo Core', color: '#6366f1' },
        { id: 'emerald', name: 'Emerald Forest', color: '#10b981' },
        { id: 'rose', name: 'Rose Petal', color: '#f43f5e' },
        { id: 'amber', name: 'Amber Glow', color: '#f59e0b' },
        { id: 'cyan', name: 'Cyan Neon', color: '#06b6d4' },
        { id: 'violet', name: 'Violet Night', color: '#8b5cf6' },
    ];

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await userListApi.getUserProfile(username);
                setProfile(data);

                // Sync theme if it's the own profile and preferences exist
                if (data.preferences?.palette && currentUser?.username === username) {
                    setPalette(data.preferences.palette);
                    localStorage.setItem('theme-palette', data.preferences.palette);
                }
            } catch (err) {
                console.error('Failed to load user profile', err);
                setError('User not found or an error occurred.');
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [username, currentUser, setPalette]);

    const handlePaletteChange = async (newPalette) => {
        if (!isOwnProfile) return;

        setSaving(true);
        try {
            setPalette(newPalette);
            await userListApi.updatePreferences(username, { palette: newPalette });
            localStorage.setItem('theme-palette', newPalette);
        } catch (err) {
            console.error('Failed to save theme preference', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="animate-spin text-accent-500" size={48} />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="text-center py-20 bg-surface rounded-2xl border border-dashed border-border mt-10">
                <h2 className="text-2xl font-bold text-text">Profile Not Found</h2>
                <p className="text-text-muted mt-2">{error}</p>
            </div>
        );
    }

    const { stats, recentItems } = profile;

    const statsConfig = [
        { key: 'PLAYING', label: 'Playing', icon: <Play size={20} className="text-accent-500" /> },
        { key: 'COMPLETED', label: 'Completed', icon: <CheckCircle2 size={20} className="text-green-500" /> },
        { key: 'BACKLOG', label: 'Backlog', icon: <Target size={20} className="text-yellow-500" /> },
        { key: 'DROPPED', label: 'Abandoned', icon: <Award size={20} className="text-red-500" /> },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
            {/* Header */}
            <header className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-6 border-b border-border">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-surface-hover border-4 border-surface shadow-xl flex items-center justify-center text-text-muted">
                    <UserCircle size={80} strokeWidth={1.5} />
                </div>
                <div className="text-center sm:text-left flex-grow">
                    <h1 className="text-4xl font-display font-bold text-text">
                        {profile.username}
                    </h1>
                    <div className="text-text-muted flex flex-wrap items-center gap-3 mt-2 justify-center sm:justify-start">
                        <span className="font-medium text-text bg-surface px-3 py-1 rounded-full text-xs border border-border flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
                            {Object.values(stats).reduce((a, b) => a + b, 0)} Active Quests
                        </span>
                        {isOwnProfile && (
                            <span className="bg-accent-500/10 text-accent-500 px-3 py-1 rounded-full border border-accent-500/20 text-[10px] font-black tracking-widest uppercase">
                                Verified Operator
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* Stats Dashboard */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statsConfig.map(stat => (
                    <div key={stat.key} className="bg-surface p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center sm:items-start gap-4 hover:-translate-y-1 transition-transform">
                        <div className="bg-surface-hover p-3 rounded-xl border border-border/50">
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-muted uppercase tracking-wider">{stat.label}</p>
                            <p className="text-3xl font-display font-bold text-text mt-1">{stats[stat.key] || 0}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Recent Activity */}
            <section>
                <div className="flex justify-between items-center mb-6 px-1">
                    <h2 className="text-2xl font-display font-bold text-text">Recent Activity</h2>
                </div>

                {recentItems?.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {recentItems.map(item => {
                            const coverUrl = getParsedCover(item.game?.cover);
                            return (
                                <div key={item.game?.igdbId || Math.random()} className="flex gap-4 p-4 rounded-2xl bg-surface border border-border shadow-sm hover:border-accent-300 transition-colors group">
                                    <Link to={`/game/${item.game?.igdbId}`} className="shrink-0 w-20 h-28 block relative overflow-hidden rounded-xl bg-background border border-border">
                                        {coverUrl ? (
                                            <img
                                                src={coverUrl}
                                                alt={item.game?.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-text-muted p-2 text-center font-bold">
                                                MISSING_DATA
                                            </div>
                                        )}
                                    </Link>
                                    <div className="flex flex-col flex-grow py-1 min-w-0">
                                        <Link to={`/game/${item.game?.igdbId}`} className="font-bold text-text hover:text-accent-500 truncate block leading-tight transition-colors">
                                            {item.game?.name}
                                        </Link>
                                        <div className="mt-2">
                                            <StatusBadge status={item.status} size="sm" />
                                        </div>
                                        {item.personalRating > 0 && (
                                            <div className="mt-auto pt-2 flex items-center gap-1.5 font-bold text-xs text-yellow-500 bg-yellow-500/5 self-start px-2 py-0.5 rounded-md border border-yellow-500/10">
                                                <Star size={12} className="fill-current" />
                                                <span>{item.personalRating}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-surface rounded-2xl border border-dashed border-border shadow-sm">
                        <p className="text-text-muted font-medium">No recent activity detected.</p>
                    </div>
                )}
            </section>

            {/* Theme Customization - Only for own profile */}
            {isOwnProfile && (
                <section className="bg-surface p-8 rounded-3xl border border-border shadow-retro-lg animate-slide-up">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-accent-500 text-white rounded-2xl shadow-retro-sm">
                            <Palette size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-bold text-text uppercase tracking-tight">Visual Interface Uplink</h2>
                            <p className="text-sm text-text-muted">Personalize your terminal accent palette.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {palettes.map(p => (
                            <button
                                key={p.id}
                                onClick={() => handlePaletteChange(p.id)}
                                disabled={saving}
                                title={p.name}
                                className={`group relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${palette === p.id
                                        ? 'border-accent-500 bg-accent-500/5 shadow-inner'
                                        : 'border-border bg-background hover:border-accent-300'
                                    }`}
                            >
                                <div
                                    className="w-10 h-10 rounded-full shadow-lg group-hover:scale-110 transition-transform flex items-center justify-center text-white"
                                    style={{ backgroundColor: p.color }}
                                >
                                    {palette === p.id && <Check size={20} strokeWidth={3} />}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-tighter ${palette === p.id ? 'text-accent-500' : 'text-text-muted'
                                    }`}>
                                    {p.name.split(' ')[0]}
                                </span>

                                {palette === p.id && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full animate-ping" />
                                )}
                            </button>
                        ))}
                    </div>

                    {saving && (
                        <div className="mt-6 flex items-center gap-3 text-xs font-bold text-accent-500 animate-pulse font-mono tracking-tighter">
                            <Loader2 size={14} className="animate-spin" />
                            <span>SYNCHRONIZING_CORE_STYLES... [OK]</span>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export default UserProfilePage;
