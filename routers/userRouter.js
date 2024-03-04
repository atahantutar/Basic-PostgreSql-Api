import express from "express";
import postgresClient from "../config/db.js";

const router = express.Router();

router.post(`/`, async (req, res) => {
  try {
    const text =
      "INSERT INTO users (email,password, fullname) VALUES ($1,crypt($2,gen_salt('bf')),$3) RETURNING * ";
    const values = [req.body.email, req.body.password, req.body.fullname];
    const { rows } = await postgresClient.query(text, values);

    return res.status(201).json({ createdUser: rows[0] });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const text =
      "SELECT * FROM users WHERE email=$1 AND password=crypt($2,password)";
    const values = [req.body.email, req.body.password];

    const { rows } = await postgresClient.query(text, values);

    res.status(200).json({ message: `Authenticate successful` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/update", async (req, res) => {
  try {
    const text = "UPDATE users SET fullname=$1 WHERE email=$2 RETURNING *";
    const values = [req.body.fullname, req.body.email];

    const { rows } = await postgresClient.query(text, values);
    res.status(200).json({ updatedUser: rows[0] });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;

router.post("/:userId", async (req, res) => {
  try {
    const text = "DELETE FROM users WHERE id= $1 RETURNING *";

    const { rows } = await postgresClient.query(text, [req.params.userId]);
    res.status(200).json({ DeletedUser: rows[0] });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const text = "SELECT * FROM users ORDER BY id ASC";
    const { rows } = await postgresClient.query(text);
    res.status(200).json({ Users: rows });
  } catch (error) {
    res.status(400).json({ Message: error.message });
  }
});
