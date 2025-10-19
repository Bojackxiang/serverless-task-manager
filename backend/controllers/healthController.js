const { checkHealth } = require("../services/healthService");
const { sendResponse } = require("../utils/response");

async function health(req, res) {
  try {
    const result = await checkHealth();
    sendResponse(res, {
      success: true,
      payload: result,
      message: "Health check successful",
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      payload: null,
      message: error.message || "Health check failed",
    });
  }
}

module.exports = { health };
