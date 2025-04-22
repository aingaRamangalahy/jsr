const fs = require('fs');
const path = require('path');

// Create required directories
const commonDir = path.join(__dirname, '../node_modules/@common');
const typesDir = path.join(commonDir, 'types');

// Create directories if they don't exist
if (!fs.existsSync(commonDir)) {
  fs.mkdirSync(commonDir, { recursive: true });
}

if (!fs.existsSync(typesDir)) {
  fs.mkdirSync(typesDir, { recursive: true });
}

// Copy common files from parent directory
const sourceDir = path.join(__dirname, '../../common');
const sourceTypesDir = path.join(sourceDir, 'types');

if (fs.existsSync(sourceTypesDir)) {
  // Copy all type files
  const typeFiles = fs.readdirSync(sourceTypesDir);
  typeFiles.forEach(file => {
    const source = path.join(sourceTypesDir, file);
    const dest = path.join(typesDir, file);
    fs.copyFileSync(source, dest);
    console.log(`Copied ${source} to ${dest}`);
  });
  
  console.log('Successfully copied common types to node_modules/@common/types');
} else {
  console.error('Source directory does not exist:', sourceTypesDir);
  process.exit(1);
}