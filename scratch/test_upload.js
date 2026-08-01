const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const Database = require("better-sqlite3");
const path = require("path");
const crypto = require("crypto");

const { parseApkBuffer } = require("@/lib/apkParser");
const { correlateCase } = require("@/lib/correlationEngine");
const { generateThreatAlerts } = require("@/lib/alertEngine");
const { generateTimeline } = require("@/lib/timelineEngine");
const { createExecutiveSummary } = require("@/lib/executiveSummaryGenerator");

async function main() {
  const dbPath = path.resolve(__dirname, "..", "prisma", "dev.db");
  const client = new Database(dbPath);
  const adapter = new PrismaBetterSqlite3(client);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Simulating APK upload...");
    const dummyBuffer = Buffer.from("PK\x03\x04" + "dummy zip content here");
    const fileName = "test_sample.apk";
    const fileSize = dummyBuffer.length;

    console.log("Parsing APK buffer...");
    const parsedApk = await parseApkBuffer(dummyBuffer, fileName);
    console.log("Parsed APK successfully! Mode:", parsedApk.analysisMode);

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomHex = crypto.randomBytes(2).toString("hex").toUpperCase();
    const caseId = `TEST-CASE-${dateStr}-${randomHex}`;

    console.log("Creating DB case with ID:", caseId);
    const newCase = await prisma.case.create({
      data: {
        id: caseId,
        fileName,
        fileSize: fileSize || parsedApk.riskBreakdown.overallScore * 50000,
        sha256: crypto.createHash("sha256").update(dummyBuffer).digest("hex"),
        status: "COMPLETED",
        analysisMode: parsedApk.analysisMode,
        packageName: parsedApk.packageName,
        versionCode: parsedApk.versionCode,
        permissions: JSON.stringify(parsedApk.permissions),
        activities: JSON.stringify(parsedApk.activities),
        services: JSON.stringify(parsedApk.services),
        mitreTags: JSON.stringify(parsedApk.mitreTags),
        threatFamily: parsedApk.threatFamily,
        threatConfidence: parsedApk.threatConfidence,
        iocs: JSON.stringify(parsedApk.iocs),
        riskScore: parsedApk.riskBreakdown.overallScore,
        permissionScore: parsedApk.riskBreakdown.permissionScore,
        iocScore: parsedApk.riskBreakdown.iocScore,
        keywordScore: parsedApk.riskBreakdown.keywordScore,
        aiConfidence: parsedApk.riskBreakdown.aiConfidence,
        malwareType: parsedApk.threatFamily,
        threatNarrative: JSON.stringify(parsedApk.threatNarrative),
        citizenImpact: JSON.stringify(parsedApk.citizenImpact),
        blockchainTxHash: parsedApk.blockchainCert.txHash,
        blockchainBlock: parsedApk.blockchainCert.block,
        blockchainTimestamp: new Date(parsedApk.blockchainCert.timestamp),
        analystReport: parsedApk.analystReport || null,
        officerReport: parsedApk.officerReport || null,
        multilingualReports: parsedApk.multilingualReports || null,
        signingCert: parsedApk.signingCert || null
      }
    });
    console.log("Case created in DB.");

    console.log("Running correlateCase...");
    await correlateCase(newCase.id);
    console.log("CorrelateCase finished.");

    console.log("Running generateThreatAlerts...");
    await generateThreatAlerts(newCase.id);
    console.log("GenerateThreatAlerts finished.");

    console.log("Running generateTimeline...");
    await generateTimeline(newCase.id, newCase.createdAt);
    console.log("GenerateTimeline finished.");

    console.log("Running createExecutiveSummary...");
    await createExecutiveSummary(newCase.id);
    console.log("CreateExecutiveSummary finished!");

    // Clean up test case
    console.log("Cleaning up test case...");
    await prisma.case.delete({ where: { id: caseId } });
    console.log("Simulation succeeded perfectly with no errors!");

  } catch (error) {
    console.error("Simulation failed with error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
