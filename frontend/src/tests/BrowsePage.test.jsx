import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import BrowsePage from '../pages/BrowsePage';
import { gamesApi } from '../api/games';

// Mock the APIs
vi.mock('../api/games', () => ({
    gamesApi: {
        searchAdvanced: vi.fn(),
    },
}));

const mockGames = [
    { igdbId: '1', name: 'Zelda', cover: 'url1', releaseDate: '2023-05-12', total_rating: 98 },
    { igdbId: '2', name: 'Mario', cover: 'url2', releaseDate: '2023-10-20', total_rating: 97 },
];

describe('BrowsePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should display expanded metadata and relocated sorting', async () => {
        gamesApi.searchAdvanced.mockResolvedValue(mockGames);

        render(
            <MemoryRouter>
                <BrowsePage />
            </MemoryRouter>
        );

        // Verify header contains sorting (Relocated)
        expect(screen.getByText(/ARCHIVE \/\/ SCANNING.../i)).toBeInTheDocument();

        // Check for some of the new platforms in the sidebar
        await waitFor(() => {
            expect(screen.getByText('PS3')).toBeInTheDocument();
            expect(screen.getByText('Atari 2600')).toBeInTheDocument();
            expect(screen.getByText('3DO')).toBeInTheDocument();
        });

        // Check for new genres
        expect(screen.getByText('Visual Novel')).toBeInTheDocument();
        expect(screen.getByText('MOBA')).toBeInTheDocument();

        // Check for themes (newly added section)
        expect(screen.getByText('Theme Nodes')).toBeInTheDocument();
        expect(screen.getByText('Survival')).toBeInTheDocument();
    });

    it('should trigger API call when a platform is selected', async () => {
        gamesApi.searchAdvanced.mockResolvedValue(mockGames);

        render(
            <MemoryRouter>
                <BrowsePage />
            </MemoryRouter>
        );

        // Wait for initial load
        await waitFor(() => expect(gamesApi.searchAdvanced).toHaveBeenCalledTimes(1));

        // Toggle PS5 filter
        const ps5Tag = screen.getAllByText('PS5')[0];
        fireEvent.click(ps5Tag);

        // Should trigger new search (debounce 300ms, wait a bit)
        await waitFor(() => {
            expect(gamesApi.searchAdvanced).toHaveBeenCalledWith(expect.objectContaining({
                platforms: ['PS5']
            }));
        }, { timeout: 1000 });
    });

    it('should handle sorting changes in the header', async () => {
        gamesApi.searchAdvanced.mockResolvedValue(mockGames);

        render(
            <MemoryRouter>
                <BrowsePage />
            </MemoryRouter>
        );

        // Find the sort select (moved to header)
        const sortSelect = screen.getByDisplayValue(/Rating High-to-Low/i);
        fireEvent.change(sortSelect, { target: { value: 'name' } });

        await waitFor(() => {
            expect(gamesApi.searchAdvanced).toHaveBeenCalledWith(expect.objectContaining({
                sortBy: 'name'
            }));
        });
    });
});
