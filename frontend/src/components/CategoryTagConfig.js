/**
 * CategoryTagConfig.js
 *
 * Per-value color maps and per-value icon assignments for the tag system.
 * Colors AND icons are assigned PER individual genre/theme/keyword value.
 * Theme/keyword/dev/publisher retain per-category icons.
 */
import {
    Gamepad2, Moon, Hash, Wrench, Megaphone,
    Compass, Joystick, Dices, Swords, Axe, Palette, Crown, Music,
    Disc3, Footprints, MousePointer, Brain, HelpCircle, Car,
    Castle, Wand2, Crosshair, Gauge, Trophy, ChessKnight,
    Target, ShieldHalf, BookOpen, User, Layers, Info,
    Globe, Zap, Briefcase, Smile, GraduationCap, Heart,
    Landmark, Ghost, Search, Book, Map, Box, Rocket, EyeOff,
    Shield, AlertTriangle
} from 'lucide-react';
import {
    SiNintendo, SiSega, SiAtari, SiMeta, SiOculus
} from 'react-icons/si';
import {
    FaWindows, FaApple, FaLinux, FaAndroid, FaXbox, FaPlaystation, FaSteam
} from 'react-icons/fa';

import logoMapData from '../assets/logoMap.json';

export const DYNAMIC_LOGOS_LIGHT = {};
export const DYNAMIC_LOGOS_DARK = {};

if (logoMapData.light) {
    for (const [key, relPath] of Object.entries(logoMapData.light)) {
        DYNAMIC_LOGOS_LIGHT[key] = `/logos/${relPath}`;
    }
}

if (logoMapData.dark) {
    for (const [key, relPath] of Object.entries(logoMapData.dark)) {
        DYNAMIC_LOGOS_DARK[key] = `/logos/${relPath}`;
    }
}

// ──────────────────────────────────────────────────────────
//  Per-Genre Icon Map (23 genres → thematically fitting)
// ──────────────────────────────────────────────────────────

export const GENRE_ICONS = {
    'Adventure': Compass,
    'Arcade': Joystick,
    'Card & Board Game': Dices,
    'Fighting': Swords,
    "Hack and slash/Beat 'em up": Axe,
    'Indie': Palette,
    'MOBA': Crown,
    'Music': Music,
    'Pinball': Disc3,
    'Platform': Footprints,
    'Point-and-click': MousePointer,
    'Puzzle': Brain,
    'Quiz/Trivia': HelpCircle,
    'Racing': Car,
    'Real Time Strategy (RTS)': Castle,
    'Role-playing (RPG)': Wand2,
    'Shooter': Crosshair,
    'Simulator': Gauge,
    'Sport': Trophy,
    'Strategy': ChessKnight,
    'Tactical': Target,
    'Turn-based strategy (TBS)': ShieldHalf,
    'Visual Novel': BookOpen,
};

const DEFAULT_GENRE_ICON = Gamepad2;

// ──────────────────────────────────────────────────────────
//  Per-Theme Icon Map (22 themes)
// ──────────────────────────────────────────────────────────

export const THEME_ICONS = {
    '4X (explore, expand, exploit, and exterminate)': Globe,
    'Action': Zap,
    'Business': Briefcase,
    'Comedy': Smile,
    'Drama': BookOpen,
    'Educational': GraduationCap,
    'Erotic': Heart,
    'Fantasy': Wand2,
    'Historical': Landmark,
    'Horror': Ghost,
    'Kids': Smile,
    'Mystery': Search,
    'Non-fiction': Book,
    'Open world': Map,
    'Party': Music,
    'Romance': Heart,
    'Sandbox': Box,
    'Science fiction': Rocket,
    'Stealth': EyeOff,
    'Survival': Shield,
    'Thriller': AlertTriangle,
    'Warfare': Crosshair,
};

// ──────────────────────────────────────────────────────────
//  Per-Category Icons (used for non-genre categories)
// ──────────────────────────────────────────────────────────

export const CATEGORY_ICONS = {
    genre: null,              // resolved per-value via GENRE_ICONS
    platform: Gamepad2,       // default fallback
    theme: Moon,
    keyword: Hash,
    developer: Wrench,
    publisher: Megaphone,
    gameMode: Layers,
    playerPerspective: User,
    other: Info,
};

export const PLATFORM_ICONS = {
    'Xbox': FaXbox,
    'PlayStation': FaPlaystation,
    'PS1': FaPlaystation,
    'PS2': FaPlaystation,
    'PS3': FaPlaystation,
    'PS4': FaPlaystation,
    'PS5': FaPlaystation,
    'PSP': FaPlaystation,
    'PS Vita': FaPlaystation,
    'Nintendo': SiNintendo,
    'Switch': SiNintendo,
    'Wii': SiNintendo,
    'GameCube': SiNintendo,
    'Game Boy': SiNintendo,
    'DS': SiNintendo,
    'NES': SiNintendo,
    'SNES': SiNintendo,
    'PC': FaWindows,
    'Windows': FaWindows,
    'Steam': FaSteam,
    'Linux': FaLinux,
    'Mac': FaApple,
    'macOS': FaApple,
    'iOS': FaApple,
    'Android': FaAndroid,
    'Sega': SiSega,
    'Atari': SiAtari,
    'Meta': SiMeta,
    'Oculus': SiOculus,
};

export const ALIAS_MAP = {
    // PlayStation
    'ps1': 'playstation',
    'ps2': 'playstation 2',
    'ps3': 'playstation 3',
    'ps4': 'playstation 4',
    'ps5': 'playstation 5',
    'psp': 'playstation portable',
    'ps vita': 'playstation vita',

    // Xbox
    'xbox series x|s': 'xbox series',

    // Nintendo
    'n64': 'nintendo 64',
    'gamecube': 'nintendo gamecube',
    'wii': 'nintendo wii',
    'wii u': 'nintendo wii u',
    'switch': 'nintendo switch',
    'switch 2': 'nintendo switch 2',
    'gba': 'game boy advance',
    'ds': 'nintendo ds',
    '3ds': 'nintendo 3ds',

    // Sega
    'genesis': 'sega genesis',
    'mega drive': 'sega mega drive',
    'saturn': 'sega saturn',

    // PC / Mobile
    'pc': 'windows',
    'pc (microsoft windows)': 'windows',
    'mac': 'apple mac os',
    'macos': 'apple mac os',

    // VR
    'meta quest': 'meta',
    'meta quest 2': 'meta',
    'meta quest 3': 'meta',
    'meta quest pro': 'meta',
    'oculus quest': 'oculus',
    'oculus quest 2': 'oculus',
    'oculus rift': 'oculus',

    // Other
    'web browser': 'controller',
};

export const FAMILY_ICONS = {
    1: FaPlaystation, // PlayStation
    2: FaXbox,        // Xbox
    3: SiNintendo,    // Nintendo
    4: SiSega,        // Sega
    5: FaWindows,     // Linux/PC
    6: SiAtari,       // Atari
    7: FaApple,       // Apple
};

export const POPULAR_PLATFORMS = [
    'PC (Microsoft Windows)',
    'PlayStation 5',
    'Xbox Series X|S',
    'Nintendo Switch',
    'PlayStation 4',
    'Xbox One',
    'PlayStation 3',
    'Xbox 360'
];

export function getBrandLogo(value, family = null, isDark = false) {
    if (!value) return null;
    let lookup = value.toLowerCase();

    // 1. Check alias map
    if (ALIAS_MAP[lookup]) lookup = ALIAS_MAP[lookup];

    // Light colored logos for Dark mode, Dark colored logos for Light mode
    const targetDict = isDark ? DYNAMIC_LOGOS_LIGHT : DYNAMIC_LOGOS_DARK;

    // 2. Exact match in targetDict
    if (targetDict[lookup]) return targetDict[lookup];

    // 3. Substring match
    const key = Object.keys(targetDict).find(k => lookup.includes(k) || k.includes(lookup));
    if (key) return targetDict[key];

    // 4. Family match fallback
    const familyMap = { 1: 'playstation', 2: 'xbox', 3: 'nintendo', 4: 'sega', 5: 'windows', 6: 'atari', 7: 'apple' };
    if (family && familyMap[family] && targetDict[familyMap[family]]) {
        return targetDict[familyMap[family]];
    }

    return null;
}

/**
 * Resolve the icon for a tag given category + value.
 * Genres/Platforms/Themes get per-value icons; other categories use CATEGORY_ICONS.
 */
export function getTagIcon(category, value, family = null) {
    if (category === 'genre') {
        return GENRE_ICONS[value] || DEFAULT_GENRE_ICON;
    }
    if (category === 'theme') {
        return THEME_ICONS[value] || CATEGORY_ICONS.theme;
    }
    if (category === 'platform') {
        // 1. Try name match
        if (PLATFORM_ICONS[value]) return PLATFORM_ICONS[value];
        // 2. Try family match (if provided)
        if (family && FAMILY_ICONS[family]) return FAMILY_ICONS[family];
        // 3. Try substring match on name
        const key = Object.keys(PLATFORM_ICONS).find(k => value.includes(k));
        return key ? PLATFORM_ICONS[key] : CATEGORY_ICONS.platform;
    }
    return CATEGORY_ICONS[category] || null;
}

// ──────────────────────────────────────────────────────────
//  Genre Color Map (23 genres)
// ──────────────────────────────────────────────────────────

export const GENRE_COLORS = {
    'Adventure': '#14b8a6',
    'Arcade': '#f97316',
    'Card & Board Game': '#f59e0b',
    'Fighting': '#ef4444',
    'Hack and slash/Beat \'em up': '#dc2626',
    'Indie': '#8b5cf6',
    'MOBA': '#d946ef',
    'Music': '#ec4899',
    'Pinball': '#84cc16',
    'Platform': '#0ea5e9',
    'Point-and-click': '#64748b',
    'Puzzle': '#06b6d4',
    'Quiz/Trivia': '#eab308',
    'Racing': '#10b981',
    'Real Time Strategy (RTS)': '#6366f1',
    'Role-playing (RPG)': '#3b82f6',
    'Shooter': '#f43f5e',
    'Simulator': '#78716c',
    'Sport': '#22c55e',
    'Strategy': '#059669',
    'Tactical': '#71717a',
    'Turn-based strategy (TBS)': '#4f46e5',
    'Visual Novel': '#fb7185',
};

// ──────────────────────────────────────────────────────────
//  Theme Color Map (22 themes)
// ──────────────────────────────────────────────────────────

export const THEME_COLORS = {
    '4X (explore, expand, exploit, and exterminate)': '#059669',
    'Action': '#ef4444',
    'Business': '#d97706',
    'Comedy': '#eab308',
    'Drama': '#9333ea',
    'Educational': '#14b8a6',
    'Erotic': '#ec4899',
    'Fantasy': '#7c3aed',
    'Historical': '#a8a29e',
    'Horror': '#b91c1c',
    'Kids': '#38bdf8',
    'Mystery': '#475569',
    'Non-fiction': '#a1a1aa',
    'Open world': '#22c55e',
    'Party': '#fb923c',
    'Romance': '#fb7185',
    'Sandbox': '#84cc16',
    'Science fiction': '#06b6d4',
    'Stealth': '#334155',
    'Survival': '#a16207',
    'Thriller': '#6b21a8',
    'Warfare': '#166534',
};

// ──────────────────────────────────────────────────────────
//  Platform Brand Colors (fixed)
// ──────────────────────────────────────────────────────────

export const PLATFORM_COLORS = {
    // Major console families (match by substring)
    'Xbox': '#52b043',
    'PlayStation': '#003087',
    'PS1': '#003087',
    'PS2': '#003087',
    'PS3': '#003087',
    'PS4': '#003087',
    'PS5': '#003087',
    'PS Vita': '#003087',
    'PSP': '#003087',
    'Nintendo': '#e60012',
    'Switch': '#e60012',
    'Wii': '#e60012',
    'Wii U': '#e60012',
    'Game Boy': '#e60012',
    'GameBoy': '#e60012',
    'Nintendo DS': '#e60012',
    'Nintendo 3DS': '#e60012',
    'Nintendo 64': '#e60012',
    'GameCube': '#e60012',
    'NES': '#e60012',
    'SNES': '#e60012',
    'Super Nintendo': '#e60012',
    // PC
    'PC': '#64748b',
    'PC (Microsoft Windows)': '#64748b',
    'Windows': '#64748b',
    'Steam': '#1b2838',
    'Linux': '#dd4814',
    'Mac': '#a8a29e',
    'macOS': '#a8a29e',
    // Mobile
    'iOS': '#0d9488',
    'Android': '#4caf50',
    // Retro / Other
    'Sega': '#17569b',
    'Mega Drive': '#17569b',
    'Genesis': '#17569b',
    'Dreamcast': '#17569b',
    'Saturn': '#17569b',
    'Master System': '#17569b',
    'Game Gear': '#17569b',
    'Atari': '#e4202e',
    'Neo Geo': '#003da5',
    'Amiga': '#e85d0c',
    'Commodore': '#e85d0c',
    '3DO': '#dc2626',
    'Amstrad': '#1e40af',
    'Intellivision': '#15803d',
    'ColecoVision': '#7e22ce',
    'Magnavox Odyssey': '#4b5563',
};

// ──────────────────────────────────────────────────────────
//  Hash-based color for keywords, devs, publishers
// ──────────────────────────────────────────────────────────

const HASH_PALETTE = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    '#f43f5e', '#78716c', '#64748b',
];

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
}

// ──────────────────────────────────────────────────────────
//  Resolve color for any category + value
// ──────────────────────────────────────────────────────────

/**
 * Get the hex color for a tag given its category and value.
 * @param {'genre'|'platform'|'theme'|'keyword'|'developer'|'publisher'} category
 * @param {string} value - The tag's display text (e.g. "RPG", "Xbox Series X|S")
 * @returns {string} hex color
 */
export function getTagColor(category, value) {
    if (!value) return '#64748b'; // fallback slate

    switch (category) {
        case 'genre':
            return GENRE_COLORS[value] || HASH_PALETTE[hashString(value) % HASH_PALETTE.length];

        case 'theme':
            return THEME_COLORS[value] || HASH_PALETTE[hashString(value) % HASH_PALETTE.length];

        case 'platform': {
            // Try exact match first, then substring match
            if (PLATFORM_COLORS[value]) return PLATFORM_COLORS[value];
            const key = Object.keys(PLATFORM_COLORS).find(k => value.includes(k));
            return key ? PLATFORM_COLORS[key] : '#64748b';
        }

        case 'keyword':
        case 'developer':
        case 'publisher':
            return HASH_PALETTE[hashString(value) % HASH_PALETTE.length];

        default:
            return '#64748b';
    }
}

/**
 * Generate CSS styles for a tag in light or dark mode.
 * Uses the hex color at different opacities for fill, border, and text.
 * @param {string} hexColor - Base hex color
 * @param {boolean} isDark - Whether dark mode is active
 * @returns {{ background: string, borderColor: string, color: string }}
 */
export function getTagStyles(hexColor, isDark = false) {
    if (isDark) {
        return {
            background: `linear-gradient(135deg, ${hexColor}33 0%, ${hexColor}1a 100%)`, // 20% to 10%
            borderColor: `${hexColor}66`, // 40% opacity
            color: hexColor,              // full color
            boxShadow: `0 0 10px ${hexColor}1a`, // subtle glow
        };
    }
    return {
        background: `linear-gradient(135deg, ${hexColor}26 0%, ${hexColor}0d 100%)`, // 15% to 5%
        borderColor: `${hexColor}4d`,   // 30% opacity
        color: hexColor,
    };
}
