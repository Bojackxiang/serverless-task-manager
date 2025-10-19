const { getHealthStatus } = require("../dao/healthDao");

async function checkHealth() {
  // Add more checks as needed
  const dbStatus = await getHealthStatus();
  return {
    status: "ok",
    db: dbStatus.db,
  };
}

module.exports = { checkHealth };
