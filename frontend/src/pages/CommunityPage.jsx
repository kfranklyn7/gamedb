import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userListApi } from '../api/userList';
import { Users, Loader2, UserCircle, Play, CheckCircle2 } from 'lucide-react';

const CommunityPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCommunity = async () => {
            try {
                const data = await userListApi.getCommunityUsers();
                setUsers(data || []);
            } catch (err) {
                console.error("Failed to load community users", err);
            } finally {
                setLoading(false);
            }
        };
        loadCommunity();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col items-center animate-pulse">
                            <div className="w-16 h-16 rounded-full bg-border/20 mb-4"></div>
                            <div className="h-6 w-24 bg-border/30 rounded mb-4"></div>
                            <div className="flex gap-4 w-full justify-center opacity-50">
                                <div className="h-8 w-8 bg-border/20 rounded"></div>
                                <div className="h-8 w-8 bg-border/20 rounded"></div>
                                <div className="h-8 w-8 bg-border/20 rounded"></div>
                            </div>
                            <div className="mt-6 flex w-full gap-2">
                                <div className="h-8 flex-1 bg-border/20 rounded-xl"></div>
                                <div className="h-8 flex-1 bg-border/20 rounded-xl"></div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (users.length === 0) {
            return (
                <div className="text-center py-12 bg-surface rounded-2xl border border-dashed border-border">
                    <p className="text-text-muted">No users found in the system.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {users.map(user => {
                    const totalGames = Object.values(user.stats || {}).reduce((a, b) => a + b, 0);
                    const playing = user.stats?.PLAYING || 0;
                    const completed = user.stats?.COMPLETED || 0;
                    
                    return (
                        <div key={user.username} className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:-translate-y-1 hover:border-accent-400 transition-all group flex flex-col items-center flex-grow text-center">
                            <Link to={`/profile/${user.username}`} className="w-16 h-16 rounded-full bg-surface-hover border-2 border-border group-hover:border-accent-500 flex items-center justify-center text-text-muted mb-4 transition-colors">
                                <UserCircle size={40} />
                            </Link>
                            <Link to={`/profile/${user.username}`} className="font-display font-bold text-xl text-text group-hover:text-accent-500 transition-colors truncate w-full">
                                {user.username}
                            </Link>
                            
                            <div className="mt-4 flex gap-4 text-sm font-medium w-full justify-center">
                                <div className="flex flex-col items-center">
                                    <span className="text-text-muted text-[10px] uppercase tracking-wider">Total</span>
                                    <span className="text-text">{totalGames}</span>
                                </div>
                                <div className="w-px bg-border"></div>
                                <div className="flex flex-col items-center">
                                    <span className="text-text-muted text-[10px] uppercase tracking-wider flex items-center gap-1"><Play size={10} className="text-accent-500"/> Active</span>
                                    <span className="text-text">{playing}</span>
                                </div>
                                <div className="w-px bg-border"></div>
                                <div className="flex flex-col items-center">
                                    <span className="text-text-muted text-[10px] uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={10} className="text-green-500"/> Done</span>
                                    <span className="text-text">{completed}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex w-full gap-2 font-display text-sm tracking-wide font-bold">
                                <Link to={`/profile/${user.username}`} className="flex-1 py-1.5 bg-surface-hover text-text border border-border hover:bg-white/5 rounded-xl transition-colors">
                                    Profile
                                </Link>
                                <Link to={`/user/${user.username}/list`} className="flex-1 py-1.5 bg-accent-500/10 text-accent-500 border border-accent-500/20 hover:bg-accent-500 hover:text-white rounded-xl transition-colors">
                                    View List
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="animate-fade-in pb-12">
            <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-surface rounded-2xl shadow-sm border border-border mb-6">
                    <Users size={40} className="text-accent-500" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-display font-bold text-text mb-4">Community</h1>
                <p className="text-text-muted text-lg max-w-2xl mx-auto">
                    Discover other operators and explore their quest logs.
                </p>
            </div>

            {renderContent()}
        </div>
    );
};

export default CommunityPage;
