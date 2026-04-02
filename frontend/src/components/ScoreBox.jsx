import React from 'react';
import { Star, Trophy } from 'lucide-react';

/**
 * ScoreBox — displays either a Community Score or Personal XP score.
 *
 * The two types are visually distinct:
 * - Community: amber/gold tint, star icon, shows vote count
 * - Personal: indigo/accent tint, trophy icon, shows /10 scale
 *
 * @param {'community'|'personal'} type
 * @param {number|null} score - The score value (0-100 for community, 0-10 for personal)
 * @param {number} [voteCount] - Number of community votes (community type only)
 * @param {'sm'|'md'|'lg'} size
 */
const ScoreBox = ({ type, score, voteCount, game, size = 'md' }) => {
    const isCommunity = type === 'community';
    let isQuestlog = false;

    let finalScore = score;
    let finalVoteCount = voteCount;

    if (isCommunity && game) {
        if (game.communityRatingCount >= 2 && game.communityRating != null) {
            finalScore = game.communityRating * 10; // scaled 0-100
            finalVoteCount = game.communityRatingCount;
            isQuestlog = true;
        } else if (game.total_rating != null) {
            finalScore = game.total_rating;
            finalVoteCount = game.total_rating_count;
        }
    }

    // Format score
    const displayScore = () => {
        if (finalScore === null || finalScore === undefined) return '--';
        if (isCommunity) return (finalScore / 10).toFixed(1); // 0-100 → 0.0-10.0
        return typeof finalScore === 'number' ? finalScore.toFixed(1) : finalScore; // personal is 0-10
    };

    const config = isCommunity
        ? isQuestlog ? {
            label: 'Questlog',
            icon: Star,
            bgLight: 'bg-emerald-50',
            bgDark: 'dark:bg-emerald-950/40',
            borderLight: 'border-emerald-200',
            borderDark: 'dark:border-emerald-800',
            textColor: 'text-emerald-700 dark:text-emerald-400',
            iconColor: 'text-emerald-500 dark:text-emerald-400',
            suffix: '',
        } : {
            label: 'IGDB',
            icon: Star,
            bgLight: 'bg-amber-50',
            bgDark: 'dark:bg-amber-950/40',
            borderLight: 'border-amber-200',
            borderDark: 'dark:border-amber-800',
            textColor: 'text-amber-700 dark:text-amber-400',
            iconColor: 'text-amber-500 dark:text-amber-400',
            suffix: '',
        }
        : {
            label: 'Your XP',
            icon: Trophy,
            bgLight: 'bg-accent-50',
            bgDark: 'dark:bg-accent-950/40',
            borderLight: 'border-accent-200',
            borderDark: 'dark:border-accent-800',
            textColor: 'text-accent-700 dark:text-accent-400',
            iconColor: 'text-accent-600 dark:text-accent-400',
            suffix: '/10',
        };

    const Icon = config.icon;

    const sizeStyles = {
        sm: {
            container: 'px-2 py-1.5 min-w-[70px]',
            label: 'text-[9px]',
            score: 'text-base',
            icon: 12,
            sub: 'text-[9px]',
        },
        md: {
            container: 'px-3 py-2 min-w-[90px]',
            label: 'text-[10px]',
            score: 'text-lg',
            icon: 14,
            sub: 'text-[10px]',
        },
        lg: {
            container: 'px-4 py-3 min-w-[110px]',
            label: 'text-xs',
            score: 'text-xl',
            icon: 16,
            sub: 'text-xs',
        },
    };

    const s = sizeStyles[size];

    return (
        <div
            className={`
        flex flex-col items-center justify-center rounded-lg border
        ${config.bgLight} ${config.bgDark}
        ${config.borderLight} ${config.borderDark}
        ${s.container}
      `}
        >
            {/* Label */}
            <span className={`uppercase tracking-wider font-bold text-text-muted ${s.label}`}>
                {config.label}
            </span>

            {/* Score + Icon */}
            <div className={`flex items-center gap-1 font-display font-bold ${config.textColor} ${s.score}`}>
                <Icon size={s.icon} className={`${config.iconColor} shrink-0`} fill="currentColor" />
                <span>{displayScore()}{config.suffix}</span>
            </div>

            {/* Sub-info */}
            {isCommunity && finalVoteCount != null && (
                <span className={`text-text-muted ${s.sub}`}>
                    {finalVoteCount.toLocaleString()} votes
                </span>
            )}
        </div>
    );
};

export default ScoreBox;
