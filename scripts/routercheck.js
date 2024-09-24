// param: npm run router:check

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Determine the directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const routerPath = path.join(__dirname, '../src/router/index.js');
const srcPath = path.join(__dirname, '../src');

// Read the router file
const routerFileContent = fs.readFileSync(routerPath, 'utf-8');

// Extract registered components from the router file
const registeredComponents = [];
const componentRegex = /import\(['"](\.\.\/[^'"]+)['"]\)/g;
let match;
while ((match = componentRegex.exec(routerFileContent)) !== null) {
    registeredComponents.push(match[1]);
}

// Check if each registered component exists
let allComponentsExist = true;
registeredComponents.forEach(component => {
    const componentFilePath = path.resolve(srcPath, component.replace('../', ''));
    if (!fs.existsSync(componentFilePath)) {
        console.log(`❌ Component ${component} does not exist in the src directory`);
        allComponentsExist = false;
    }
});

if (allComponentsExist) {
    console.log('✅ All registered components exist in the src directory');
}
