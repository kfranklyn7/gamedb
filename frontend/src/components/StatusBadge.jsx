import React from 'react';
import { Play, CheckCircle2, ListTodo, PauseCircle, XCircle } from 'lucide-react';

export const STATUS_CONFIG = {
    PLAYING: {
        label: 'Playing',
        colorText: 'text-blue-700 dark:text-blue-400',
        colorBg: 'bg-blue-50 dark:bg-blue-950/50',
        colorBorder: 'border-blue-400 dark:border-blue-700',
        icon: Play
    },
    COMPLETED: {
        label: 'Completed',
        colorText: 'text-green-700 dark:text-green-400',
        colorBg: 'bg-green-50 dark:bg-green-950/50',
        colorBorder: 'border-green-400 dark:border-green-700',
        icon: CheckCircle2
    },
    PLAN_TO_PLAY: {
        label: 'Plan to Play',
        colorText: 'text-violet-700 dark:text-violet-400',
        colorBg: 'bg-violet-50 dark:bg-violet-950/50',
        colorBorder: 'border-violet-400 dark:border-violet-700',
        icon: ListTodo
    },
    ON_HOLD: {
        label: 'On Hold',
        colorText: 'text-amber-700 dark:text-amber-400',
        colorBg: 'bg-amber-50 dark:bg-amber-950/50',
        colorBorder: 'border-amber-400 dark:border-amber-700',
        icon: PauseCircle
    },
    DROPPED: {
        label: 'Dropped',
        colorText: 'text-red-700 dark:text-red-400',
        colorBg: 'bg-red-50 dark:bg-red-950/50',
        colorBorder: 'border-red-400 dark:border-red-700',
        icon: XCircle
    }
};

const StatusBadge = ({ status, size = 'md', showLabel = true }) => {
    if (!status || !STATUS_CONFIG[status]) return null;

    const config = STATUS_CONFIG[status];
    const Icon = config.icon;

    const sizeClass = {
        sm: 'text-xs px-2 py-0.5 gap-1',
        md: 'text-sm px-2.5 py-1 gap-1.5',
        lg: 'text-base px-3 py-1.5 gap-2'
    }[size];

    const iconSize = {
        sm: 12,
        md: 14,
        lg: 18
    }[size];

    return (
        <div className={`inline-flex items-center rounded-full font-medium border ${config.colorText} ${config.colorBg} ${config.colorBorder} ${sizeClass}`}>
            <Icon size={iconSize} className="shrink-0" />
            {showLabel && <span>{config.label}</span>}
        </div>
    );
};

export default StatusBadge;
