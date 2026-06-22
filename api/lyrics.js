const { jioGet } = require('../lib/jiosaavn');
const { success, error } = require('../lib/response');

module.exports = async (req, res) => {
  global.__start = Date.now();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id) return error(res, 'Missing required parameter: id');

  const data = await jioGet('lyrics.getLyrics', { lyrics_id: id });
  if (!data) return error(res, 'Lyrics not found', 404);

  return success(res, {
    id,
    lyrics: data.lyrics || data.text || '',
  });
};
