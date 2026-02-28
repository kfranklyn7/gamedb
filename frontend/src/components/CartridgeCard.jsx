import React from 'react';
import { Link } from 'react-router-dom';
import { getParsedCover } from '../utils/imageUtils';
import { Edit3, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

const CartridgeCard = ({ listItem, onEdit, onDelete }) => {
    const { game, status, personalRating } = listItem;
    const coverUrl = getParsedCover(game.cover);

    const genreTags = game.genreNames || [];
    const visibleGenres = genreTags.slice(0, 3);
    const publisher = game.publishers?.[0] || '';
    const developer = game.developers?.[0] || '';
    const pubDev = [publisher, developer].filter(Boolean).join(' · ');

    return (
        <div className="relative flex w-full bg-[#828488] dark:bg-[#4d4f53] rounded-t-[40px] rounded-b-md shadow-[0_15px_25px_rgba(0,0,0,0.6)] px-4 py-5 border-b-[6px] border-[#5a5c5f] dark:border-[#2a2b2d] group cursor-pointer hover:-translate-y-1 transition-transform min-h-[170px] overflow-hidden">

            {/* Top curves & indents for N64 cartridge plastic body look */}
            <div className="absolute top-0 left-0 w-full h-[30px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none z-10 rounded-t-[40px] opacity-40"></div>

            {/* Left/Right architectural inset grips */}
            <div className="absolute top-[30px] bottom-0 left-[20px] w-[8px] bg-[#6a6c70] dark:bg-[#383a3d] shadow-[inset_2px_0_4px_rgba(0,0,0,0.5),1px_0_1px_rgba(255,255,255,0.1)] rounded-t-full pointer-events-none"></div>
            <div className="absolute top-[30px] bottom-0 right-[20px] w-[8px] bg-[#6a6c70] dark:bg-[#383a3d] shadow-[inset_-2px_0_4px_rgba(0,0,0,0.5),-1px_0_1px_rgba(255,255,255,0.1)] rounded-t-full pointer-events-none"></div>

            {/* Inner top indent above the label */}
            <div className="absolute top-[16px] left-[40px] right-[40px] h-[12px] bg-[#6a6c70] dark:bg-[#383a3d] rounded-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.6)] pointer-events-none"></div>

            {/* The Front Center Label (Inset glossy paper) */}
            <div className="flex-grow flex bg-[#111] rounded shadow-[inset_0_2px_8px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.3)] mt-[20px] mx-[22px] mb-0 relative z-20 overflow-hidden border border-black group-hover:shadow-[inset_0_2px_8px_rgba(0,0,0,0.9),0_0_10px_rgba(255,255,255,0.15)] transition-shadow">

                {/* Wrapped Link covering the art and info so it redirects correctly */}
                <Link to={`/game/${game.igdbId}`} className="absolute inset-0 z-30"></Link>

                {/* Label artwork left side */}
                <div className="w-[110px] sm:w-[130px] shrink-0 bg-black relative pointer-events-none">
                    <img src={coverUrl} className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-500" alt="Cartridge Label" />
                    {/* Gradient fade to black on right to blend into meta area seamlessly */}
                    <div className="absolute inset-y-0 right-0 w-[40px] bg-gradient-to-l from-[#111] to-transparent"></div>
                </div>

                {/* Label info right side */}
                <div className="flex-grow p-3 flex flex-col justify-between relative z-10 bg-[#111] pointer-events-none">
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-white font-display tracking-tight leading-tight line-clamp-2">{game.name}</h3>
                        {pubDev && <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest truncate">{pubDev}</p>}
                    </div>

                    <div className="flex flex-col gap-2 mt-auto pt-2">
                        <div className="flex gap-1.5 flex-wrap">
                            <StatusBadge status={status} size="sm" />
                            {visibleGenres.map(g => <span key={g} className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white font-bold uppercase tracking-wider">{g}</span>)}
                        </div>

                        <div className="flex items-center gap-3 border-t border-white/10 pt-2 relative z-40">
                            {/* Score badges */}
                            <span className="bg-black/80 px-1.5 py-0.5 rounded shadow-inner text-amber-500 font-bold text-xs flex items-center gap-1 border border-white/5">⭐ {game.total_rating ? Math.round(game.total_rating) : '-'}</span>
                            <span className="bg-black/80 px-1.5 py-0.5 rounded shadow-inner text-accent-400 font-bold text-xs flex items-center gap-1 border border-white/5">🏆 {personalRating || '-'}</span>

                            {/* Actions (with pointer-events-auto to override the Link above) */}
                            <div className="ml-auto flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-auto">
                                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(listItem); }} className="text-white/60 hover:text-white transition-colors" title="Edit Entry"><Edit3 size={14} /></button>
                                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(game.igdbId); }} className="text-white/60 hover:text-red-400 transition-colors" title="Remove"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartridgeCard;
