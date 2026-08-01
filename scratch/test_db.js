const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const path = require("path");

async function main() {
  const dbPath = path.resolve(__dirname, "..", "prisma", "dev.db");
  console.log("Database URL:", `file:${dbPath}`);
  const adapter = new PrismaBetterSqlite3({
    url: `file:${dbPath}`,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Querying database...");
    const cases = await prisma.case.findMany({ take: 5 });
    console.log("Cases found:", cases.length);
  } catch (err) {
    console.error("Prisma error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
