import express from "express";
import postgresClint from "./config/db.js";
import userRouter from "./routers/userRouter.js";

const app = express();

app.use(express.json());
app.use(`/users`, userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on  port ${PORT}`);
  postgresClint.connect((err) => {
    err
      ? console.log(`connection error ${err}`)
      : console.log(`db connection successful`);
  });
});
