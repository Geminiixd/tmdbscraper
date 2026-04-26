const https = require('https');
const fs = require('fs');
const path = require('path');

// Create directories
if (!fs.existsSync('data')) fs.mkdirSync('data');
if (!fs.existsSync('images')) fs.mkdirSync('images');
if (!fs.existsSync('images/anime')) fs.mkdirSync('images/anime');
if (!fs.existsSync('images/movies')) fs.mkdirSync('images/movies');

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function fetchAnime() {
  // Fetch anime data
  const animeData = await fetchJSON('https://api.jikan.moe/v4/top/anime?limit=25');
  
  // Download images
  for (const anime of animeData.data) {
    const imageUrl = anime.images.jpg.large_image_url;
    const filename = `images/anime/${anime.mal_id}.jpg`;
    
    try {
      await downloadImage(imageUrl, filename);
      anime.localImage = filename; // Add local path to data
    } catch (err) {
      console.error(`Failed to download image for ${anime.title}`);
    }
  }
  
  fs.writeFileSync('data/anime.json', JSON.stringify(animeData, null, 2));
}

// Similar for movies...
