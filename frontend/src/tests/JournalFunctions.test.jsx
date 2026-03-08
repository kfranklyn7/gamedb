import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import MyListPage from '../pages/MyListPage';
import { userListApi } from '../api/userList';

// Mock the APIs
vi.mock('../api/userList', () => ({
    userListApi: {
        getList: vi.fn(),
    },
}));

const mockListData = [
    {
        game: { igdbId: '1', name: 'Alpha Quest', genreNames: ['Action'], platformNames: ['PC'], total_rating: 80 },
        status: 'COMPLETED',
        personalRating: 9,
        priority: 'HIGH',
        lastUpdated: '2023-01-01T10:00:00Z'
    },
    {
        game: { igdbId: '2', name: 'Zeta Quest', genreNames: ['RPG'], platformNames: ['PS5'], total_rating: 90 },
        status: 'WANT_TO_PLAY',
        personalRating: 0,
        priority: 'LOW',
        lastUpdated: '2023-02-01T10:00:00Z'
    }
];

describe('Journal Functions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should sort games correctly in MyListPage', async () => {
        userListApi.getList.mockResolvedValue({ items: mockListData });

        render(
            <MemoryRouter>
                <MyListPage />
            </MemoryRouter>
        );

        // Wait for initial load
        await waitFor(() => expect(screen.getByText('Alpha Quest')).toBeInTheDocument());

        // Check initial order
        const titles = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent);
        expect(titles[0]).toBe('Alpha Quest');
        expect(titles[1]).toBe('Zeta Quest');

        // Change sort to Name (Z-A)
        const sortBtn = screen.getByText(/Name \(A→Z\)/i);
        fireEvent.click(sortBtn);
        const zaOption = screen.getByText(/Name \(Z→A\)/i);
        fireEvent.click(zaOption);

        // Verify new order
        await waitFor(() => {
            const newTitles = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent);
            expect(newTitles[0]).toBe('Zeta Quest');
            expect(newTitles[1]).toBe('Alpha Quest');
        });
    });

    it('should filter games by genre in MyListPage', async () => {
        userListApi.getList.mockResolvedValue({ items: mockListData });

        render(
            <MemoryRouter>
                <MyListPage />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Alpha Quest')).toBeInTheDocument());

        // Open filters
        const filterBtn = screen.getByText(/Filter/i);
        fireEvent.click(filterBtn);

        // Toggle Action filter (Alpha Quest has Action)
        // There might be multiple "Action" texts, pick the button/chip
        const actionFilter = screen.getAllByText('Action').find(el => el.closest('button'));
        fireEvent.click(actionFilter);

        // Only Alpha Quest should remain
        await waitFor(() => {
            expect(screen.getByText('Alpha Quest')).toBeInTheDocument();
            expect(screen.queryByText('Zeta Quest')).not.toBeInTheDocument();
        });
    });
});
