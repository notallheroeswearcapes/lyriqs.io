import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const response = {
    msg: "Backend working fine."
}

app.get('/api', (req: Request, res: Response) => {
    console.log("Request received.")
    res.send("hallo");
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});