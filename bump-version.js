const fs = require("fs");

const pkgPath = "package.json";
const extPath = "vss-extension.json";

// Đọc file
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const ext = JSON.parse(fs.readFileSync(extPath, "utf8"));

let [major, minor, patch] = pkg.version.split(".").map(Number);

// Logic tăng version
patch++;
if (patch >= 10) {
  patch = 0;
  minor++;
  if (minor >= 10) {
    minor = 0;
    major++;
  }
}

const newVersion = `${major}.${minor}.${patch}`;

// Cập nhật lại version
pkg.version = newVersion;
ext.version = newVersion;

// Ghi lại file
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
fs.writeFileSync(extPath, JSON.stringify(ext, null, 2));

console.log(`✅ Version bumped to ${newVersion}`);
