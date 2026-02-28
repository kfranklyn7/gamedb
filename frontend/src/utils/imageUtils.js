export const getParsedCover = (cover, size = 't_cover_big') => {
    if (!cover) return 'https://placehold.co/264x352?text=No+Cover';

    // Handle both string URLs and IGDB image objects
    let url = typeof cover === 'string' ? cover : (cover.url || '');
    if (!url) return 'https://placehold.co/264x352?text=No+Cover';

    // Normalize size and aggressively strip any existing protocol mess
    // Matches nested things like "https://https//", "https:", "//", etc.
    let cleaned = url.replace('t_thumb', size)
        .replace(/^(https?:\/*|\/*)+/, '');

    const finalUrl = `https://${cleaned}`;

    return finalUrl;
};
