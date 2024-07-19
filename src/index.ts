import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import { MongoClient } from "./database/mongo";
import { config } from "dotenv";
import routes from "./routes";

const main = async () => {
  config();
  const app = express();
  await MongoClient.connect();
  const port = process.env.PORT || 3000;

  app.use(
    cors({
      credentials: true,
    })
  );

  app.use(compression());
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use("/api", routes);

  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`Server is running ...`);
    console.log(`avaible routes: `);
    console.log(`GET     -  http://localhost:${port}/api/`);
    console.log(`POST    -  http://localhost:${port}/api/userprofile/create`);
    console.log(`GET     -  http://localhost:${port}/api/userprofile/all`);
    console.log(`POST    -  http://localhost:${port}/api/userprofile/login`);
    console.log(
      `DELETE  -  http://localhost:${port}/api/userprofile/delete/user/:id`
    );
  });
};

main();
