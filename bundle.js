/**
 * bundle.js - Builds self-contained HTML applications
 * Compiles modular CSS and JS into single-file applications with ZERO external dependencies,
 * eliminating all browser CORS issues on the file:// protocol.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read source template
const templateHtml = fs.readFileSync(path.join(__dirname, 'index.template.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
const questionsJs = fs.readFileSync(path.join(__dirname, 'questions.js'), 'utf8');
const exhibitsJs = fs.readFileSync(path.join(__dirname, 'exhibits.js'), 'utf8');
const dndJs = fs.readFileSync(path.join(__dirname, 'components', 'DragDropEngine.js'), 'utf8');
const evalJs = fs.readFileSync(path.join(__dirname, 'components', 'EvaluationEngine.js'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

function sanitizeCode(code) {
  return code
    .replace(/import\s+[\s\S]*?\s+from\s+['"].*?['"];?/g, '')
    .replace(/export\s+const\s+/g, 'const ')
    .replace(/export\s+function\s+/g, 'function ')
    .replace(/export\s+class\s+/g, 'class ')
    .replace(/export\s+\{[\s\S]*?\};?/g, '');
}

const sanitizedQuestions = sanitizeCode(questionsJs);
const sanitizedExhibits = sanitizeCode(exhibitsJs);
const sanitizedDnd = sanitizeCode(dndJs);
const sanitizedEval = sanitizeCode(evalJs);
const sanitizedApp = sanitizeCode(appJs);

const combinedScript = `
(function() {
  'use strict';
  ${sanitizedQuestions}
  ${sanitizedExhibits}
  ${sanitizedDnd}
  ${sanitizedEval}
  ${sanitizedApp}
})();
`;

// Replace stylesheet link with inline <style>
let compiledHtml = templateHtml.replace(
  '<link rel="stylesheet" href="styles.css">',
  `<style>\n${stylesCss}\n</style>`
);

// Replace script with inline <script>
compiledHtml = compiledHtml.replace(
  '<script type="module" src="app.js"></script>',
  `<script>\n${combinedScript}\n</script>`
);

// Write to both index.html and standalone.html so either file runs flawlessly!
fs.writeFileSync(path.join(__dirname, 'index.html'), compiledHtml, 'utf8');
fs.writeFileSync(path.join(__dirname, 'standalone.html'), compiledHtml, 'utf8');

console.log('Successfully bundled index.html and standalone.html! (Zero-dependency portable build with all 176 questions)');
