const prisma = require("../lib/prisma");

// Placeholder for health DAO, for future DB checks
async function getHealthStatus() {
  // Try a simple DB query to check connection
  try {
    await prisma.user.findFirst();
    return { db: "ok" };
  } catch (e) {
    return { db: "error", error: e.message };
  }
}

module.exports = { getHealthStatus };
