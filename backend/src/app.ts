import express from 'express';

const app = express();

app.use(express.json());

app.use('/api/healthcheck', (_, res) => {
    res.status(200).json({
        message: "Server health is OK!",
        success: true
    })
})


export default app;