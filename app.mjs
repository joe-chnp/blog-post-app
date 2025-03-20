import express from "express";
import memberRouter from "./routes/member.mjs";
import blogPostRouter from "./routes/post.mjs";

const app = express();
const port = 4000;

app.use(express.json());
app.use("/members", memberRouter);
app.use("/posts", blogPostRouter);

app.get("/test", (req, res) => {
    return res.json("Server API is Working");
});

// Express Assignment
app.get("/profiles", (req, res) => {
    return res.json({
        "data":  {
            "name": "john",
            "age": 20
        },
    });
});
// Express Assignment

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});