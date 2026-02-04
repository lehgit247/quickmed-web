// test-path.js
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiPath = path.join(__dirname, 'app/api/payment/receipt/[reference]/route.js');
const componentPath = path.join(__dirname, 'components/ReceiptPDF.jsx');

console.log('API path:', apiPath);
console.log('Component path:', componentPath);

// Calculate relative path
const relative = path.relative(
  path.dirname(apiPath),
  path.dirname(componentPath)
);

console.log('Relative path:', path.join(relative, 'ReceiptPDF.jsx'));