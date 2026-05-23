import app from "./app.js";
import envConfig from "./config/envConfig.js";



app.listen(envConfig.PORT, () => {
    console.log(`Server sun raha hai ${envConfig.PORT} port par!`);
})