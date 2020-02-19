const Pool = require('pg').Pool;
const pool = new Pool(
    !process.env.SERVER_LOCALHOST === 1 ? {
        user: 'jeguglie',
        host: 'localhost',
        database: 'api',
        password: process.env.DATABASE_LOCALHOST_PASSWORD,
        port: 5432,
    } : { connectionString: process.env.DATABASE_URL }

);

module.exports = pool;