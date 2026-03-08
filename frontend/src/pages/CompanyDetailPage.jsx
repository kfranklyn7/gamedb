import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, Loader2 } from 'lucide-react';
import { companiesApi } from '../api/companies';
import { getParsedCover } from '../utils/imageUtils';

const CompanyDetailPage = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCompany = async () => {
            try {
                const data = await companiesApi.getCompanyById(id);
                setCompany(data);
            } catch (err) {
                console.error('Failed to load company details', err);
            } finally {
                setLoading(false);
            }
        };
        loadCompany();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center flex-col gap-4 items-center min-h-[60vh]">
                <Loader2 className="animate-spin text-accent-500" size={48} />
                <p className="text-text-muted font-medium animate-pulse">Accessing Corporate Records...</p>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="text-center py-20 bg-surface rounded-2xl border border-dashed border-border mt-10">
                <h2 className="text-2xl font-bold text-text">Company Not Found</h2>
                <p className="text-text-muted mt-2">No records exist for this organization in our database.</p>
            </div>
        );
    }

    const renderGameGrid = (games, title) => {
        if (!games || games.length === 0) return null;

        // Deduplicate games by id just in case
        const uniqueGames = [];
        const seenIds = new Set();
        games.forEach(g => {
            if (g && g.igdbId && !seenIds.has(g.igdbId)) {
                seenIds.add(g.igdbId);
                uniqueGames.push(g);
            }
        });

        if (uniqueGames.length === 0) return null;

        return (
            <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-2xl font-display font-bold text-text">{title}</h3>
                    <span className="bg-surface-hover px-3 py-1 rounded-full text-xs font-bold text-text-muted border border-border">
                        {uniqueGames.length} Titles
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {uniqueGames.map(game => {
                        const coverUrl = getParsedCover(game.cover);
                        return (
                            <Link key={game.igdbId} to={`/game/${game.igdbId}`} className="group relative block aspect-[3/4] rounded-xl overflow-hidden bg-surface border border-border shadow-sm hover:shadow-accent-500/20 hover:border-accent-500/50 transition-all duration-300">
                                {coverUrl ? (
                                    <img
                                        src={coverUrl}
                                        alt={game.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-surface-hover border-t-2 border-accent-500/20 group-hover:bg-surface transition-colors">
                                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-3 shadow-inner">
                                            <span className="font-bold text-accent-500 text-lg">?</span>
                                        </div>
                                        <span className="font-bold text-[13px] text-text-muted line-clamp-3">{game.name}</span>
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent p-3 pt-8 translate-y-2 group-hover:translate-y-0 transition-transform">
                                    <span className="text-text font-bold text-sm leading-tight line-clamp-2">{game.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>
        );
    };

    return (
        <div className="animate-fade-in relative max-w-7xl mx-auto">
            {/* Header Section */}
            <header className="mb-12 relative overflow-hidden rounded-3xl bg-surface border border-border p-8 md:p-12 shadow-sm text-center">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-accent-500/20 to-transparent blur-3xl" />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-background border border-border shadow-md flex items-center justify-center mb-6">
                        <Building2 size={40} className="text-accent-500" />
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-text mb-4 tracking-tight">
                        {company.name}
                    </h1>

                    {company.description && (
                        <p className="text-lg md:text-xl text-text-muted max-w-3xl leading-relaxed">
                            {company.description}
                        </p>
                    )}
                </div>
            </header>

            {/* Portfolio Content */}
            <div className="space-y-4">
                {renderGameGrid(company.developed, "Developed Games")}
                {renderGameGrid(company.published, "Published Games")}

                {(!company.developed?.length && !company.published?.length) && (
                    <div className="text-center py-20 bg-surface rounded-2xl border border-dashed border-border mt-10">
                        <h2 className="text-2xl font-bold text-text opacity-50">Empty Portfolio</h2>
                        <p className="text-text-muted mt-2">No games are currently associated with this company in our records.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyDetailPage;
