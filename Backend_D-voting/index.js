import dotenv from "dotenv";
import { connection_DB } from "./db/connect.js";
import { app } from "./app.js";

dotenv.config();


connection_DB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Db connection error ", err);
  });
