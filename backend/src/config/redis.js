const { createClient }  = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-11168.c9.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 11168
    }
});

module.exports = redisClient;