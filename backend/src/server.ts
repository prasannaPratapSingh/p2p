import app from "./app.js";
import envConfig from "./config/envConfig.js";
import connectDB from "./infrastructure/database/mongoose.js";



app.listen(envConfig.PORT, async () => {
    await connectDB();
    console.log(`Server sun raha hai ${envConfig.PORT} port par!`);
})

