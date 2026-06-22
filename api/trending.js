const { jioGet, parseTrack } = require('../lib/jiosaavn');
const { decryptUrl } = require('../lib/decrypt');
const { success, error } = require('../lib/response');

module.exports = async (req, res) => {
  global.__start = Date.now();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const data = await jioGet('content.getTrending');
  if (!data) return error(res, 'Could not fetch trending', 500);

  let songs = data.songs || [];
  if (typeof songs === 'object' && !Array.isArray(songs)) songs = songs.songs || [];
  const tracks = songs.slice(0, 30).map(s => parseTrack(s, decryptUrl));

  return success(res, tracks);
};
