const Pool = require('pg').Pool;
const pool = process.env.SERVER_LOCALHOST === JSON.stringify(true) ? 
                new Pool({
                            user: 'jeguglie',
                            host: 'localhost',
                            database: 'api',
                            password: process.env.DATABASE_LOCALHOST_PASSWORD,
                            port: 5432}) :
                new Pool({  connectionString: process.env.DATABASE_URL });
module.exports = pool;