import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

//middlewares
app.use(express.json());

app.listen(PORT, () => {
  console.log(`server start from port ${PORT}`);
});
