const Pool = require('pg').Pool;
const pool = new Pool(
    !process.env.DATABASE_URL ? {
        user: 'jeguglie',
        host: 'localhost',
        database: 'api',
        password: '06245547Jv345102.',
        port: 5432,
    } : { connectionString: process.env.DATABASE_URL }

);

module.exports = pool;