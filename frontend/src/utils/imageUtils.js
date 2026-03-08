export const getIgdbImageId = (img) => {
    if (!img) return null;
    if (typeof img === 'string') {
        // If it's already a full IGDB URL, extract the ID
        if (img.includes('images.igdb.com')) {
            const parts = img.split('/');
            const lastPart = parts[parts.length - 1];
            return lastPart.replace('.jpg', '').replace('.png', '').replace('.webp', '');
        }
        return img;
    }
    return img.image_id || img.imageId || null;
};

export const getParsedCover = (cover, size = 't_cover_big') => {
    if (!cover) return 'https://placehold.co/264x352?text=No+Cover';

    const imgId = getIgdbImageId(cover);
    if (!imgId) return 'https://placehold.co/264x352?text=No+Cover';

    // If still looks like a URL, just return it (fallback)
    if (imgId.startsWith('http')) return imgId;

    return `https://images.igdb.com/igdb/image/upload/${size}/${imgId}.jpg`;
};
