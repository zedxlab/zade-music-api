function success(res, data, extra = {}) {
  const start = global.__start || Date.now();
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  return res.status(200).json({
    success: true,
    owner: '@zade4everbot',
    powered_by: 'Zora AI by Zade',
    time_elapsed: `${Date.now() - start}ms`,
    ...extra,
    data,
  });
}

function error(res, message, status = 400) {
  const start = global.__start || Date.now();
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  return res.status(status).json({
    success: false,
    owner: '@zade4everbot',
    powered_by: 'Zora AI by Zade',
    time_elapsed: `${Date.now() - start}ms`,
    error: message,
  });
}

module.exports = { success, error };
