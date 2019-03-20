import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import { createConnection } from "typeorm";
import cors from 'cors';
import path from 'path';

require('dotenv').config();
createConnection({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_SERVER_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        __dirname + "/entity/*.js",
        __dirname + "/entity/*.ts",
    ],
    synchronize: false,
}).then(async () => {
    console.log('success connect DB');
}).catch(error => console.log(error))
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, '/../build')));
app.use("/", require("./routes/user"));
app.use("/", require("./routes/login"));
app.use("/", require("./routes/push"));
app.use(express.static(path.join(__dirname, '../../../Web/project-debugger-web/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../Web/project-debugger-web/build/index.html'));
});
app.use((req: Request, res: Response, next: NextFunction) => {
    res.send("not find resource!!!!");
});
app.set("port", process.env.SERVER_PORT || 3000);
export default app;
