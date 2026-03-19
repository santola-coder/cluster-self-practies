const express = require("express");
const cors = require("cors");
const mysql2 = require("mysql2/promise");

const app = express();

const pool = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "St!@#20031901",
  database: "ecmDB",
});

app.use(cors());
app.use(express.json());

app.get("/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    if (rows.length === 0) {
      res.status(404).json({
        message: " Product not found",
      });
      return rows;
    } else {
      res.status(200).json(rows);
    }
    return rows;
  } catch (error) {
    console.error("Database Error:", error);

    res.status(500).json({
      success: false,
      message: "internal Server Error",
      error: error.message,
    });
  }
});

//  post/

app.post("/products", async (req, res) => {
  try {
    console.log(req.body);

    const sql = `INSERT INTO products (name, category, description) VALUES (?, ?, ?)`;
    const { name, category, description } = req.body;

    if (!name || !category || !description) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const [result] = await pool.query(sql, [name, category, description]);

    // select * from only id

    const [rows] = await pool.query(`SELECT * FROM products WHERE id = ? `, [
      result.insertId,
    ]);

    const productId = Number(req.params.id);

    const products = products.find((p) => p === productId);
    
    

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("Insert Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
