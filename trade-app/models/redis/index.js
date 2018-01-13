import AppConfig from '../../config/app-config'

var asyncRedis = require("async-redis"),
    client = asyncRedis.createClient({
        "host": AppConfig.redis.host,
        "port": AppConfig.redis.port,
        "password": AppConfig.redis.password
    });

module.exports = client;