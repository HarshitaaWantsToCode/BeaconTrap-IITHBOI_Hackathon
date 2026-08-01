const fs = require("fs");
const path = require("path");

async function main() {
  try {
    const apkPath = path.resolve(__dirname, "..", "apks", "Banking_Trojan_Sample.apk");
    const fileContent = fs.readFileSync(apkPath);
    
    const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
    
    const bodyHeader = 
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="Banking_Trojan_Sample.apk"\r\n` +
      `Content-Type: application/vnd.android.package-archive\r\n\r\n`;
    
    const bodyFooter = `\r\n--${boundary}--\r\n`;
    
    const body = Buffer.concat([
      Buffer.from(bodyHeader, "utf8"),
      fileContent,
      Buffer.from(bodyFooter, "utf8")
    ]);

    console.log("Sending POST request to http://localhost:3001/api/cases/upload...");
    const res = await fetch("http://localhost:3001/api/cases/upload", {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": body.length.toString()
      },
      body: body
    });

    console.log("Response Status:", res.status);
    const text = await res.text();
    console.log("Response Body:", text);

  } catch (error) {
    console.error("Request failed:", error);
  }
}

main();
