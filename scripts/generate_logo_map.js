import fs from 'fs';
import path from 'path';

const logosDir = path.resolve('./logos');
const mapFile = path.resolve('./frontend/src/assets/logoMap.json');

function scanDir(dir, baseDir, result) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            scanDir(fullPath, baseDir, result);
        } else if (file.endsWith('.svg')) {
            const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
            
            let cleanName = file.replace('.svg', '');
            cleanName = cleanName.replace(/[-_.,]+[0-9]+(-[0-9]+)*$/, '');
            cleanName = cleanName.replace(/\s*\(.*?\)\s*/g, '').trim();
            cleanName = cleanName.replace(/_+$/, '').replace(/-+$/, '').trim();
            cleanName = cleanName.replace('Sony Playstation', 'PlayStation');
            cleanName = cleanName.replace('Microsoft Xbox', 'Xbox');
            cleanName = cleanName.replace('Nintendo Entertainment System', 'NES');
            cleanName = cleanName.replace('Super Nintendo Entertainment System', 'SNES');
            cleanName = cleanName.replace('Nintendo Super Famicom', 'SNES');
            cleanName = cleanName.replace('Nintendo Famicom', 'NES');
            cleanName = cleanName.toLowerCase();

            if (!result[cleanName]) {
                result[cleanName] = relPath;
            }
        }
    }
}

const map = { light: {}, dark: {} };
if (fs.existsSync(path.join(logosDir, 'Light - Color'))) {
    scanDir(path.join(logosDir, 'Light - Color'), logosDir, map.light);
}
if (fs.existsSync(path.join(logosDir, 'Dark - Color'))) {
    scanDir(path.join(logosDir, 'Dark - Color'), logosDir, map.dark);
}

// Fallback logic for building the maps:
// If a logo is missing in Dark, try to grab it from Light, and vice versa.
const allKeys = new Set([...Object.keys(map.light), ...Object.keys(map.dark)]);
allKeys.forEach(key => {
    if (!map.light[key] && map.dark[key]) map.light[key] = map.dark[key];
    if (!map.dark[key] && map.light[key]) map.dark[key] = map.light[key];
});

fs.writeFileSync(mapFile, JSON.stringify(map, null, 2));
console.log('logoMap.json generated successfully!');
