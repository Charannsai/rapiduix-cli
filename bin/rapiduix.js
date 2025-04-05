#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('follow-redirects').https;

const component = process.argv[2];

if (!component) {
  console.log('❌ Please provide a component name.');
  console.log('👉 Example: npx rapiduix Accordion');
  process.exit(1);
}

const BASE_URL = 'https://raw.githubusercontent.com/charannsai/rapiduix-components/main/react-native';
const fileUrl = `${BASE_URL}/${component}/${component}.tsx`;
const outputPath = path.join(process.cwd(), 'components', `${component}.tsx`);

https.get(fileUrl, (res) => {
  if (res.statusCode !== 200) {
    console.error(`❌ Component "${component}" not found on server. Status: ${res.statusCode}`);
    return;
  }

  let data = '';
  res.on('data', chunk => (data += chunk));
  res.on('end', () => {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, data);
    console.log(`✅ Installed "${component}" to ./components/${component}.tsx`);
  });
}).on('error', (err) => {
  console.error('❌ Error fetching component:', err.message);
});
