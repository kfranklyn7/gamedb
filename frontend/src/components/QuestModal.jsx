import React, { useState, useEffect } from 'react';
import { X, CalendarDays, RefreshCw, AlertTriangle } from 'lucide-react';
import { STATUS_CONFIG } from './StatusBadge';

const SCORE_LABELS = {
    0: 'Not Rated',
    1: 'Appalling',
    2: 'Horrible',
    3: 'Very Bad',
    4: 'Bad',
    5: 'Average',
    6: 'Fine',
    7: 'Good',
    8: 'Very Good',
    9: 'Great',
    10: 'Masterpiece',
};

const PRIORITY_OPTIONS = [
    { value: null, label: 'None', color: '' },
    { value: 'LOW', label: 'Low', color: 'text-slate-500 bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800' },
    { value: 'MEDIUM', label: 'Medium', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' },
    { value: 'HIGH', label: 'High', color: 'text-red-600 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800' },
];

const QuestModal = ({
    isOpen, onClose, onSubmit,
    initialStatus = 'PLAN_TO_PLAY',
    initialRating = null,
    initialReview = '',
    initialReplayCount = 0,
    initialStartedAt = null,
    initialCompletedAt = null,
    initialPriority = null,
    title = 'Accept Quest'
}) => {
    const [status, setStatus] = useState(initialStatus);
    const [personalRating, setPersonalRating] = useState(initialRating || 0);
    const [review, setReview] = useState(initialReview);
    const [replayCount, setReplayCount] = useState(initialReplayCount || 0);
    const [startedAt, setStartedAt] = useState(initialStartedAt ? initialStartedAt.split('T')[0] : '');
    const [completedAt, setCompletedAt] = useState(initialCompletedAt ? initialCompletedAt.split('T')[0] : '');
    const [priority, setPriority] = useState(initialPriority);

    useEffect(() => {
        if (isOpen) {
            setStatus(initialStatus);
            setPersonalRating(initialRating || 0);
            setReview(initialReview || '');
            setReplayCount(initialReplayCount || 0);
            setStartedAt(initialStartedAt ? new Date(initialStartedAt).toISOString().split('T')[0] : '');
            setCompletedAt(initialCompletedAt ? new Date(initialCompletedAt).toISOString().split('T')[0] : '');
            setPriority(initialPriority);
        }
    }, [isOpen, initialStatus, initialRating, initialReview, initialReplayCount, initialStartedAt, initialCompletedAt, initialPriority]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            status,
            personalRating: personalRating || null,
            review,
            replayCount: replayCount || 0,
            startedAt: startedAt ? new Date(startedAt).toISOString() : null,
            completedAt: completedAt ? new Date(completedAt).toISOString() : null,
            priority,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl relative animate-slide-up">

                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-text-muted hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-display font-bold mb-6 text-text">{title}</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Status Selection */}
                    <div>
                        <label className="block text-sm font-bold text-text mb-2">Quest Status</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {Object.entries(STATUS_CONFIG).map(([k, config]) => {
                                const Icon = config.icon;
                                const isSelected = status === k;
                                return (
                                    <button
                                        key={k}
                                        type="button"
                                        onClick={() => setStatus(k)}
                                        className={`flex items-center gap-2 p-2 rounded-lg border text-sm font-medium transition-all ${isSelected
                                            ? `${config.colorBg} ${config.colorBorder} ${config.colorText} ring-2 ring-accent-500/20`
                                            : 'bg-background border-border text-text-muted hover:border-accent-400'
                                            }`}
                                    >
                                        <Icon size={16} />
                                        {config.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* XP / Rating Slider with label */}
                    <div>
                        <label className="flex justify-between text-sm font-bold text-text mb-2">
                            <span>XP Earned (Rating)</span>
                            <span className="font-display text-accent-600">
                                {personalRating > 0 ? `${personalRating.toFixed(1)} / 10 — ${SCORE_LABELS[Math.floor(personalRating)] || ''}` : SCORE_LABELS[0]}
                            </span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.5"
                            value={personalRating}
                            onChange={(e) => setPersonalRating(parseFloat(e.target.value))}
                            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent-500"
                        />
                        <div className="flex justify-between text-xs text-text-muted mt-1 font-medium">
                            <span>0 (None)</span>
                            <span>10 (Masterpiece)</span>
                        </div>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-bold text-text mb-2">Backlog Priority</label>
                        <div className="flex gap-2">
                            {PRIORITY_OPTIONS.map(opt => (
                                <button
                                    key={opt.value || 'none'}
                                    type="button"
                                    onClick={() => setPriority(opt.value)}
                                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${priority === opt.value
                                            ? opt.color || 'text-text bg-surface border-accent-400 ring-2 ring-accent-500/20'
                                            : 'bg-background border-border text-text-muted hover:border-accent-400'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dates row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-1.5 text-sm font-bold text-text mb-2">
                                <CalendarDays size={14} className="text-text-muted" />
                                Started
                            </label>
                            <input
                                type="date"
                                value={startedAt}
                                onChange={(e) => setStartedAt(e.target.value)}
                                className="w-full p-2.5 bg-background border border-border rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-sm font-bold text-text mb-2">
                                <CalendarDays size={14} className="text-text-muted" />
                                Completed
                            </label>
                            <input
                                type="date"
                                value={completedAt}
                                onChange={(e) => setCompletedAt(e.target.value)}
                                className="w-full p-2.5 bg-background border border-border rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Replay Count */}
                    <div>
                        <label className="flex items-center gap-1.5 text-sm font-bold text-text mb-2">
                            <RefreshCw size={14} className="text-text-muted" />
                            Replay Count
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setReplayCount(Math.max(0, replayCount - 1))}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-border
                           bg-background hover:bg-accent-50 dark:hover:bg-accent-950/30
                           text-text font-bold transition-colors"
                            >
                                −
                            </button>
                            <span className="font-display font-bold text-lg text-text min-w-[2ch] text-center">
                                {replayCount}
                            </span>
                            <button
                                type="button"
                                onClick={() => setReplayCount(replayCount + 1)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-border
                           bg-background hover:bg-accent-50 dark:hover:bg-accent-950/30
                           text-text font-bold transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Journal Notes / Review */}
                    <div>
                        <label className="block text-sm font-bold text-text mb-2">Journal Notes</label>
                        <textarea
                            rows="3"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Record your thoughts on this quest..."
                            className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 font-medium text-text bg-background border border-border rounded-lg hover:bg-surface hover:text-text-muted transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 font-display tracking-wide font-medium text-white bg-accent-500 rounded-lg shadow-md hover:bg-accent-600 transition-colors"
                        >
                            Save Entry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuestModal;
