import app from "./app.js";
import envConfig from "./config/envConfig.js";
import connectDB from "./infrastructure/database/mongoose.js";
import connectRedis from "./infrastructure/redis/redis.js";




app.listen(envConfig.PORT, async () => {
    await connectDB();
    await connectRedis();
    console.log(`Server sun raha hai ${envConfig.PORT} port par!`);
})

