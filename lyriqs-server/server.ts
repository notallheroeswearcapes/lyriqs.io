import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
import musixmatchRouter from './routes/musixmatch';
const port = process.env.PORT;

app.use(cors());

app.get('/api', (req, res) => {
    console.log("Request received.")
    res.send("hallo");
});

app.use('/songs?', musixmatchRouter);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});