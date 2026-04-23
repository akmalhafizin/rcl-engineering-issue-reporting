const fs = require('fs');
const configContent = `
const config = {
    ROOT: '${process.env.ROOT || ''}',
    ADMIN_ID: '${process.env.ADMIN_ID}',
    ADMIN_PASSWORD: '${process.env.ADMIN_PASSWORD}'
};
`;
fs.writeFileSync('./assets/js/config.js', configContent);
console.log('✅ config.js generated from environment variables');