const fs = require("fs");

const pkgPath = "package.json";
const extPath = "vss-extension.json";

// Đọc file
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const ext = JSON.parse(fs.readFileSync(extPath, "utf8"));

// Tăng version patch
let [major, minor, patch] = pkg.version.split(".").map(Number);
patch++;
const newVersion = `${major}.${minor}.${patch}`;

// Gán lại
pkg.version = newVersion;
ext.version = newVersion;

// Ghi file
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
fs.writeFileSync(extPath, JSON.stringify(ext, null, 2));

console.log(`✅ Version bumped to ${newVersion}`);
