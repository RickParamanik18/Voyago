import express from "express";
import "dotenv/config";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: "Hello, World!" });
});

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
});
