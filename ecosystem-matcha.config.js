module.exports = {
    "apps": [{
        "name": "MATCHA",
        "script": "npm",
        "args": "start",
        "env": {
            NODE_ENV: "development",
            PORT: 5000,
            SECRET_KEY: "secretOrKey",
            DB_PASSWD: "",
            DB_HOST: "localhost",
            DB_NAME: "matcha",
            DB_USER: "postgres",
            DB_PORT: 5432,
            MAIL_KEY: "",
            MAIL_SECRET: "",
        },
        "env_production": {
            NODE_ENV: "production",
            SECRET_KEY: "secretOrKey",
            PORT: 5000,
            DB_PASSWD: "",
            DB_HOST: "localhost",
            DB_NAME: "matcha",
            DB_USER: "postgres",
            DB_PORT: 5432,
            MAIL_KEY: "",
            MAIL_SECRET: "",
        }
    }],
    deploy: {
        production: {
            key: '/Users/jv/.ssh/id_rsa',
            user: "jvg",
            host: ["jv-g.fr"],
            ssh_options: "StrictHostKeyChecking=no",
            ref: "origin/master",
            repo: "https://github.com/jeguglie/MatchApp.git",
            path: "/home/jvg/www/matcha.jv-g.fr/",
            'post-deploy': "cd /home/jvg/www/matcha.jv-g.fr/ &&" + 
            "cp /home/jvg/ecosystem-matcha.config.js ./ecosystem-matcha.config.js &&" + 
            "npm run build && pm2 start ecosystem-matcha.config.js --env production"
        }
    }
}