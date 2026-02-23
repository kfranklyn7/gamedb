import React from 'react';
import { LayoutGrid, AlignJustify, Square } from 'lucide-react';

/**
 * ViewToggle — segmented toggle for switching between Chip, Cartridge, and Case views.
 *
 * @param {'chip'|'cartridge'|'case'} activeView
 * @param {(view: string) => void} onViewChange
 * @param {boolean} showCase - Whether to show the Case option (hidden on mobile/tablet)
 */
const VIEW_OPTIONS = [
    { key: 'chip', label: 'Chip', icon: LayoutGrid, desc: 'Compact grid view' },
    { key: 'cartridge', label: 'Cartridge', icon: AlignJustify, desc: 'Medium list view' },
    { key: 'case', label: 'Case', icon: Square, desc: 'Full detail view' },
];

const ViewToggle = ({ activeView, onViewChange, showCase = true }) => {
    const options = showCase
        ? VIEW_OPTIONS
        : VIEW_OPTIONS.filter(o => o.key !== 'case');

    return (
        <div className="inline-flex items-center rounded-lg border border-border bg-surface overflow-hidden">
            {options.map((opt, i) => {
                const Icon = opt.icon;
                const isActive = activeView === opt.key;

                return (
                    <button
                        key={opt.key}
                        type="button"
                        onClick={() => onViewChange(opt.key)}
                        className={`
              relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
              transition-all duration-150
              ${i > 0 ? 'border-l border-border' : ''}
              ${isActive
                                ? 'bg-accent-100 dark:bg-accent-950/50 text-accent-700 dark:text-accent-400'
                                : 'text-text-muted hover:bg-surface hover:text-text'
                            }
            `}
                        title={opt.desc}
                        aria-pressed={isActive}
                    >
                        <Icon size={14} />
                        <span className="hidden sm:inline">{opt.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default ViewToggle;
