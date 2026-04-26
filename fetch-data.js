const https = require('https');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

(async () => {
    // Fetch anime from Jikan
    const anime = await fetchData('https://api.jikan.moe/v4/top/anime?limit=50');
    fs.writeFileSync(path.join(dataDir, 'anime.json'), JSON.stringify(anime, null, 2));

    await new Promise(r => setTimeout(r, 2000));

    const seasonal = await fetchData('https://api.jikan.moe/v4/seasons/now?limit=50');
    fs.writeFileSync(path.join(dataDir, 'seasonal-anime.json'), JSON.stringify(seasonal, null, 2));

    console.log('✓ Data fetched successfully');
})();
