// Placeholder for health DAO, for future DB checks
async function getHealthStatus() {
  // In future, check DB connection here (e.g., Prisma)
  return { db: 'ok' };
}

module.exports = { getHealthStatus };
