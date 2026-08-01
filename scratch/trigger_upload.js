const fs = require("fs");

async function main() {
  try {
    console.log("Preparing form data...");
    // Create a mock zip/apk file buffer: magic PK\x03\x04
    const fileContent = Buffer.from("PK\x03\x04" + "dummy zip data");
    
    // We can use native fetch or a standard multipart form data construct
    const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
    
    const bodyHeader = 
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="test_sample.apk"\r\n` +
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
