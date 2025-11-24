import express from "express";
import "dotenv/config";
import cors from "cors";
import { agent } from "./graph/index.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
    const result = await agent.invoke({});
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
});
