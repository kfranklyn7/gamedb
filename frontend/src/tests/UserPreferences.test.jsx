import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Mock the contexts
vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

vi.mock('../context/ThemeContext', () => ({
    useTheme: vi.fn(),
}));

describe('User Preferences (Navbar Settings)', () => {
    const setPalette = vi.fn();
    const setCorners = vi.fn();
    const setDensity = vi.fn();
    const setEffects = vi.fn();
    const toggleMode = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useAuth.mockReturnValue({
            isAuthenticated: true,
            user: { username: 'testuser' },
            logout: vi.fn(),
        });
        useTheme.mockReturnValue({
            mode: 'dark',
            toggleMode,
            palette: 'terminal',
            setPalette,
            density: 'comfortable',
            setDensity,
            corners: 'rounded',
            setCorners,
            effects: 'on',
            setEffects,
        });
    });

    it('should allow changing UI settings in the settings modal', async () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        // Open settings
        const settingsBtn = screen.getByRole('button', { name: /settings/i });
        fireEvent.click(settingsBtn);

        // Verify modal is open
        expect(screen.getByText(/UI_SYSTEM \/\/ CONFIG/i)).toBeInTheDocument();

        // Change palette
        const retroBtn = screen.getByText('Retro (Amber)');
        fireEvent.click(retroBtn);
        expect(setPalette).toHaveBeenCalledWith('retro');

        // Change corners
        const sharpBtn = screen.getByText('SHARP');
        fireEvent.click(sharpBtn);
        expect(setCorners).toHaveBeenCalledWith('sharp');

        // Change density
        const compactBtn = screen.getByText('COMPACT');
        fireEvent.click(compactBtn);
        expect(setDensity).toHaveBeenCalledWith('compact');

        // Change effects (Buttons have uppercase text like "OFF", "ON", "DIM")
        const offBtn = screen.getByText(/OFF/i);
        fireEvent.click(offBtn);
        expect(setEffects).toHaveBeenCalledWith('off');
    });

    it('should toggle theme mode', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        // Theme toggle button has aria-label="Toggle Theme"
        const modeBtn = screen.getByRole('button', { name: /toggle theme/i });
        fireEvent.click(modeBtn);
        expect(toggleMode).toHaveBeenCalled();
    });
});
