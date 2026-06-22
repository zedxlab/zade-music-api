const { jioGet } = require('../lib/jiosaavn');
const { success, error } = require('../lib/response');

module.exports = async (req, res) => {
  global.__start = Date.now();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const data = await jioGet('content.getBrowseModules');
  if (!data) return error(res, 'Could not fetch browse data', 500);

  return success(res, data);
};
