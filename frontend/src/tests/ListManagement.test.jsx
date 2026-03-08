import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import GameDetailPage from '../pages/GameDetailPage';
import MyListPage from '../pages/MyListPage';
import { gamesApi } from '../api/games';
import { userListApi } from '../api/userList';
import { AuthProvider } from '../context/AuthContext';

// Mock the APIs
vi.mock('../api/games', () => ({
    gamesApi: {
        getGameById: vi.fn(),
    },
}));

vi.mock('../api/userList', () => ({
    userListApi: {
        addItem: vi.fn(),
        updateItem: vi.fn(),
        removeItem: vi.fn(),
        getList: vi.fn(),
    },
}));

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        isAuthenticated: true,
        user: { username: 'testuser' },
    }),
    AuthProvider: ({ children }) => <div>{children}</div>,
}));

const mockGame = {
    igdbId: '123',
    name: 'Trial of the Agent',
    cover: 'cover_url',
    releaseDate: '2025-01-01',
    genres: [{ name: 'Action' }],
    platforms: [{ name: 'PC' }],
    total_rating: 95,
};

describe('List Management', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call addItem when adding a game in GameDetailPage', async () => {
        gamesApi.getGameById.mockResolvedValue(mockGame);
        userListApi.addItem.mockResolvedValue({});

        render(
            <MemoryRouter initialEntries={['/game/123']}>
                <Routes>
                    <Route path="/game/:id" element={<GameDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        // Wait for game to load
        await waitFor(() => expect(screen.getByText('Trial of the Agent')).toBeInTheDocument());

        // Click Add to Journal (Accept Quest button)
        const addBtn = screen.getByText(/ACCEPT QUEST/i);
        fireEvent.click(addBtn);

        // Wait for modal and submit (Save Entry button)
        const submitBtn = screen.getByText(/SAVE ENTRY/i);
        fireEvent.click(submitBtn);

        expect(userListApi.addItem).toHaveBeenCalledWith(expect.objectContaining({
            gameId: '123',
        }));
    });

    it('should display games in MyListPage and handle removal', async () => {
        const mockListItem = {
            game: mockGame,
            status: 'WANT_TO_PLAY',
            personalRating: 5,
            priority: 'HIGH',
        };
        userListApi.getList.mockResolvedValue({ items: [mockListItem] });
        userListApi.removeItem.mockResolvedValue({});

        // Mock window.confirm
        const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);

        render(
            <MemoryRouter>
                <MyListPage />
            </MemoryRouter>
        );

        // Wait for list to load
        await waitFor(() => expect(screen.getByText('Trial of the Agent')).toBeInTheDocument());

        // Click Delete/Abandon (CartridgeCard has "Remove" title)
        const deleteBtn = screen.getByTitle(/Remove/i);
        fireEvent.click(deleteBtn);

        expect(confirmSpy).toHaveBeenCalled();
        expect(userListApi.removeItem).toHaveBeenCalledWith('123');
    });
});
