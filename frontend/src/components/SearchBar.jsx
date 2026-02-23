import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, initialValue = '' }) => {
    const [term, setTerm] = React.useState(initialValue);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(term);
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-accent-500 transition-colors">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Search quests... (games, franchises, themes)"
                    className="block w-full pl-12 pr-4 py-3 sm:py-4 bg-surface border-2 border-border rounded-xl text-text placeholder-text-muted/70 focus:outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 transition-all font-medium text-lg shadow-sm"
                />
                <button
                    type="submit"
                    className="absolute inset-y-2 right-2 px-4 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                    Search
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
