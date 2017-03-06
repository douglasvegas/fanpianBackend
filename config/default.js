module.exports = {
    port: 3000,
    mongodb: 'mongodb://localhost:27017/fanpian',
    upload: {
        path: process.cwd() + '/uploads'
    },
    session: {
        secret: 'fanpian',
        key   : 'fanpian',
        maxAge: 2592000000
    }
}