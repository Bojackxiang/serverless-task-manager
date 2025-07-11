// Global response utility
function sendResponse(
  res,
  { success = true, payload = null, message = "", ...rest }
) {
  res.json({
    success,
    payload,
    message,
    ...rest,
  });
}

module.exports = { sendResponse };
