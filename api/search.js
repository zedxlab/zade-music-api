const { jioGet, parseTrack } = require('../lib/jiosaavn');
const { decryptUrl } = require('../lib/decrypt');
const { success, error } = require('../lib/response');

module.exports = async (req, res) => {
  global.__start = Date.now();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { q, limit = 10 } = req.query;
  if (!q) return error(res, 'Missing required parameter: q');

  const data = await jioGet('search.getResults', { q, n: Math.min(limit, 50) });
  if (!data || !data.results) return error(res, 'No results found', 404);

  const tracks = data.results.slice(0, limit).map(s => parseTrack(s, decryptUrl));
  return success(res, tracks);
};
