const fs = require('fs');
const configContent = `
const config = {
    ROOT: '${process.env.ROOT || ''}',
    SUPABASE_URL: '${process.env.SUPABASE_URL}',
    SUPABASE_ANON_KEY: '${process.env.SUPABASE_ANON_KEY}'
};
`;
fs.writeFileSync('./assets/js/config.js', configContent);
console.log('✅ config.js generated from environment variables');