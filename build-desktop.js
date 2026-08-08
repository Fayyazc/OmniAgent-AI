/**
 * OmniAgent OS — Manual Desktop App Builder
 * Uses the already-cached Electron zip to build the app without electron-builder
 * Run: node build-desktop.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const ELECTRON_ZIP = path.join(
  os.homedir(),
  'AppData/Local/electron/Cache',
  '85f2b7422cd2141b6caa99bac0fc0658b0f22b533b571f6a2ec9a49f2ac23c0a',
  'electron-v43.3.0-win32-x64.zip'
);

const OUT_DIR   = 'C:\\OmniAgentApp';
const APP_DIR   = path.join(OUT_DIR, 'resources', 'app');
const PROJECT   = __dirname;

console.log('\n🚀 OmniAgent OS Desktop App Builder');
console.log('=====================================\n');

// 1. Check Electron zip exists
if (!fs.existsSync(ELECTRON_ZIP)) {
  console.error('❌ Electron zip not found at:', ELECTRON_ZIP);
  console.error('   Run: npm run electron:build first to download it.');
  process.exit(1);
}
console.log('✅ Electron zip found:', ELECTRON_ZIP);

// 2. Clean + create output dir
if (fs.existsSync(OUT_DIR)) {
  console.log('🧹 Cleaning previous build...');
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUT_DIR, { recursive: true });
console.log('📁 Output directory created:', OUT_DIR);

// 3. Extract Electron zip into OUT_DIR
console.log('📦 Extracting Electron runtime...');
execSync(`powershell -command "Expand-Archive -Path '${ELECTRON_ZIP}' -DestinationPath '${OUT_DIR}' -Force"`, { stdio: 'inherit' });
console.log('✅ Electron runtime extracted');

// 4. Rename electron.exe → OmniAgentOS.exe
const electronExe = path.join(OUT_DIR, 'electron.exe');
const appExe      = path.join(OUT_DIR, 'OmniAgentOS.exe');
if (fs.existsSync(electronExe)) {
  fs.renameSync(electronExe, appExe);
  console.log('✅ Renamed electron.exe → OmniAgentOS.exe');
}

// 5. Create resources/app directory
fs.mkdirSync(APP_DIR, { recursive: true });

// 6. Copy Electron main + preload
const electronSrc = path.join(PROJECT, 'electron');
fs.cpSync(electronSrc, path.join(APP_DIR, 'electron'), { recursive: true });
console.log('✅ Copied electron/ (main.js + preload.js)');

// 7. Copy dist (built React app)
const distSrc = path.join(PROJECT, 'dist');
if (!fs.existsSync(distSrc)) {
  console.error('❌ dist/ not found. Run: npm run build first');
  process.exit(1);
}
fs.cpSync(distSrc, path.join(APP_DIR, 'dist'), { recursive: true });
console.log('✅ Copied dist/ (React app bundle)');

// 8. Copy public assets
const publicSrc = path.join(PROJECT, 'public');
if (fs.existsSync(publicSrc)) {
  fs.cpSync(publicSrc, path.join(APP_DIR, 'public'), { recursive: true });
}
console.log('✅ Copied public/ (icons + assets)');

// 9. Write package.json into app dir (Electron reads this for main entry)
const appPackage = {
  name: 'omniagent-os',
  productName: 'OmniAgent OS',
  version: '1.0.0',
  description: 'Your AI Digital Employee',
  main: 'electron/main.js'
};
fs.writeFileSync(
  path.join(APP_DIR, 'package.json'),
  JSON.stringify(appPackage, null, 2),
  'utf-8'
);
console.log('✅ package.json written into app resources');

// 10. Done!
console.log('\n🎉 OmniAgent OS Desktop App is READY!');
console.log('======================================');
console.log(`📂 App folder:  ${OUT_DIR}`);
console.log(`▶️  Launch:      ${appExe}`);
console.log('\n📋 Instructions:');
console.log('  1. Open File Explorer');
console.log('  2. Go to: C:\\OmniAgentApp\\');
console.log('  3. Double-click OmniAgentOS.exe');
console.log('  4. Right-click → Send to → Desktop (create shortcut)');
console.log('\n✅ All done. Enjoy OmniAgent OS!\n');
