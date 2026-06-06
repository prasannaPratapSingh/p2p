import app from "./app.js";
import envConfig from "./config/envConfig.js";
import { initSocket } from "./config/socket.js";
import connectDB from "./infrastructure/database/mongoose.js";
import connectRedis from "./infrastructure/redis/redis.js";
import { createServer } from 'http';

const httpServer = createServer(app);
initSocket(httpServer);


httpServer.listen(envConfig.PORT, async () => {
    await connectDB();
    await connectRedis();
    console.log(`Server is listening at ${envConfig.PORT} port 🔌`);
})

