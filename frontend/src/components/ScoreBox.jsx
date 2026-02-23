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
const ScoreBox = ({ type, score, voteCount, size = 'md' }) => {
    const isCommunity = type === 'community';

    // Format score
    const displayScore = () => {
        if (score === null || score === undefined) return '--';
        if (isCommunity) return (score / 10).toFixed(1); // 0-100 → 0.0-10.0
        return score; // personal is already 0-10
    };

    const config = isCommunity
        ? {
            label: 'Community',
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
            {isCommunity && voteCount != null && (
                <span className={`text-text-muted ${s.sub}`}>
                    {voteCount.toLocaleString()} votes
                </span>
            )}
        </div>
    );
};

export default ScoreBox;
