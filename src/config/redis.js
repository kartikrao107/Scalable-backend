const { createClient } = require("redis");

const redisClient = createClient({

    url: process.env.REDIS_URL

});

redisClient.connect()

.then(()=>{

    console.log("Redis Connected");

})

.catch(console.error);

module.exports = redisClient;