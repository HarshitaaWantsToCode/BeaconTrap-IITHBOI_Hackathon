require('ts-node').register({ transpileOnly: true });
const path = require('path');
const fs = require('fs');

const { parseApkBuffer } = require('../src/lib/apkParser.ts');
const { correlateCase } = require('../src/lib/correlationEngine.ts');
const { generateThreatAlerts } = require('../src/lib/alertEngine.ts');
const { generateTimeline } = require('../src/lib/timelineEngine.ts');
const { createExecutiveSummary } = require('../src/lib/executiveSummaryGenerator.ts');
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const Database = require('better-sqlite3');

async function main() {
  const dbPath = path.resolve(__dirname, "..", "prisma", "dev.db");
  const client = new Database(dbPath);
  const adapter = new PrismaBetterSqlite3(client);
  const prisma = new PrismaClient({ adapter });

  try {
    const dummyBuffer = Buffer.from("PK\x03\x04" + "dummy zip content here");
    const fileName = "test_sample.apk";
    console.log("Parsing APK...");
    const parsed = await parseApkBuffer(dummyBuffer, fileName);
    console.log("Parsed!");
    
    // Test case creation
    const caseId = `TEST-API-${Date.now()}`;
    const newCase = await prisma.case.create({
      data: {
        id: caseId,
        fileName,
        fileSize: dummyBuffer.length,
        sha256: "test-sha",
        status: "COMPLETED",
        analysisMode: parsed.analysisMode,
        packageName: parsed.packageName,
        versionCode: parsed.versionCode,
        permissions: JSON.stringify(parsed.permissions),
        activities: JSON.stringify(parsed.activities),
        services: JSON.stringify(parsed.services),
        mitreTags: JSON.stringify(parsed.mitreTags),
        threatFamily: parsed.threatFamily,
        threatConfidence: parsed.threatConfidence,
        iocs: JSON.stringify(parsed.iocs),
        riskScore: parsed.riskBreakdown.overallScore,
        permissionScore: parsed.riskBreakdown.permissionScore,
        iocScore: parsed.riskBreakdown.iocScore,
        keywordScore: parsed.riskBreakdown.keywordScore,
        aiConfidence: parsed.riskBreakdown.aiConfidence,
        malwareType: parsed.threatFamily,
        threatNarrative: JSON.stringify(parsed.threatNarrative),
        citizenImpact: JSON.stringify(parsed.citizenImpact),
        blockchainTxHash: parsed.blockchainCert.txHash,
        blockchainBlock: parsed.blockchainCert.block,
        blockchainTimestamp: new Date(parsed.blockchainCert.timestamp),
        analystReport: parsed.analystReport || null,
        officerReport: parsed.officerReport || null,
        multilingualReports: parsed.multilingualReports || null,
        signingCert: parsed.signingCert || null
      }
    });
    console.log("Created Case in DB.");

    console.log("Correlating...");
    await correlateCase(newCase.id);
    console.log("Correlated!");

    console.log("Generating alerts...");
    await generateThreatAlerts(newCase.id);
    console.log("Generated alerts!");

    console.log("Generating timeline...");
    await generateTimeline(newCase.id, newCase.createdAt);
    console.log("Generated timeline!");

    console.log("Generating exec summary...");
    await createExecutiveSummary(newCase.id);
    console.log("Generated exec summary!");

    await prisma.case.delete({ where: { id: caseId } });
    console.log("Cleaned up. Everything passed!");
  } catch (err) {
    console.error("CRITICAL TEST FAILED:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
