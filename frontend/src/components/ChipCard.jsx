import React from 'react';
import { Link } from 'react-router-dom';
import { STATUS_CONFIG } from './StatusBadge';

const ChipCard = ({ listItem }) => {
    const { game, status, personalRating } = listItem;
    const coverUrl = game.cover
        ? `https:${game.cover.replace('t_thumb', 't_cover_big')}`
        : 'https://placehold.co/264x374?text=No+Cover';

    const statusConfig = STATUS_CONFIG[status];

    // Fallback accent color if no status mapping
    const statusColorHex = status === 'PLAYING' ? '#0ea5e9' :
        status === 'COMPLETED' ? '#22c55e' :
            status === 'PLAN_TO_PLAY' ? '#a855f7' :
                status === 'ON_HOLD' ? '#f59e0b' :
                    status === 'DROPPED' ? '#ef4444' : '#bd1515';

    return (
        <Link
            to={`/game/${game.igdbId}`}
            className="relative flex flex-col w-full aspect-[2/3] bg-[#222] dark:bg-[#1a1a1a] shadow-[0_8px_16px_rgba(0,0,0,0.6)] cursor-pointer group hover:-translate-y-2 transition-transform duration-300"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 15% 100%, 0 calc(100% - 15%))' }}
        >
            {/* Highlights to simulate physical matte plastic shell */}
            <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_4px_rgba(0,0,0,0.8)] pointer-events-none z-20"></div>

            {/* The Inset Sticker Label */}
            <div className="absolute top-[8%] left-[6%] right-[6%] bottom-[12%] bg-[#050505] overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.1)] flex flex-col items-center border border-black group-hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_0_8px_rgba(255,255,255,0.1)] transition-shadow">

                {/* Game Art covers top 70% of sticker */}
                <div className="w-full h-[68%] relative overflow-hidden bg-black shrink-0">
                    <img src={coverUrl} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" alt="Chip Insert Art" />

                    {/* Subtle gradient to dark at bottom of cover */}
                    <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#050505] to-transparent z-10"></div>

                    {/* Switch logo phantom box (top left) */}
                    <div className="absolute top-1 left-1 w-[12px] h-[12px] border border-white/50 rounded-[1.5px] opacity-40 shadow-[0_0_2px_black] z-20"></div>
                </div>

                {/* Label footer (colored by status) */}
                <div
                    className="w-full flex-grow border-t-2 border-black/40 relative z-10 flex flex-col items-center justify-between py-1 shadow-inner"
                    style={{ backgroundColor: statusColorHex }}
                >
                    {/* Metallic/glossy reflection overlay over the painted strip */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none mix-blend-overlay"></div>

                    <h3 className="text-[10px] sm:text-[11px] font-black text-white text-center leading-[1.1] line-clamp-2 w-full px-1 mb-0.5 tracking-tight drop-shadow-md relative z-10 mt-auto">
                        {game.name}
                    </h3>

                    <div className="flex items-center justify-between w-full px-1.5 opacity-95 relative z-10 mt-auto">
                        <span className="text-white font-bold text-[8.5px] tracking-widest flex items-center gap-0.5 drop-shadow">⭐ {game.total_rating ? Math.round(game.total_rating) : '-'}</span>
                        <span className="text-white font-bold text-[8.5px] tracking-widest flex items-center gap-0.5 drop-shadow">🏆 {personalRating || '-'}</span>
                    </div>
                </div>
            </div>

            {/* Little arrow at the bottom center of the plastic */}
            <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#111] drop-shadow-[0_1px_0_rgba(255,255,255,0.05)] pointer-events-none z-10"></div>

            {/* Switch Cartridge side indent lines for physical realism */}
            <div className="absolute top-[20%] left-0 w-[2px] h-[40%] bg-black/60 shadow-[inset_1px_0_1px_rgba(255,255,255,0.05)] pointer-events-none"></div>
            <div className="absolute top-[20%] right-0 w-[2px] h-[40%] bg-black/60 shadow-[inset_-1px_0_1px_rgba(255,255,255,0.05)] pointer-events-none"></div>
        </Link>
    );
};

export default ChipCard;

