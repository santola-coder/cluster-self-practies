const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

// ===== DB CONNECTION =====
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'products_db',
});

// Simple test
(async () => {
  try {
    await db.query('SELECT 1');
    console.log('✅ MySQL connected');
  } catch (err) {
    console.log('❌ DB error:', err);
  }
})();


// =================================================
// 🟢 CATEGORY
// =================================================

// CREATE
app.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const sql = 'INSERT INTO categories (name) VALUES (?)';
    const [result] = await db.query(sql, [name]);

    res.json({
      message: 'Category created',
      id: result.insertId,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error creating category' });
  }
});


// READ ALL
app.get('/categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});


// READ ONE
app.get('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});


// UPDATE
app.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    await db.query(
      'UPDATE categories SET name = ? WHERE id = ?',
      [name, id]
    );

    res.json({ message: 'Category updated' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});


// DELETE
app.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM categories WHERE id = ?', [id]);

    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});


// =================================================
// 🔵 PRODUCT
// =================================================

// CREATE
app.post('/products', async (req, res) => {
  try {
    const { name, category_id, description } = req.body;

    if (!name || !category_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const sql = `
      INSERT INTO products (name, category_id, description)
      VALUES (?, ?, ?)
   `;

    const [result] = await db.query(sql, [
      name,
      category_id,
      description,
    ]);

    res.json({
      message: 'Product created',
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ message: 'Create failed' });
  }
});


// READ ALL (JOIN)
app.get('/products', async (req, res) => {
  try {
    const sql = `
      SELECT 
        p.id,
        p.name,
        p.description,
        c.name AS category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;

    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
});


// READ ONE
app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        p.id,
        p.name,
        p.description,
        c.name AS category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    if (!rows.length) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});


// UPDATE
app.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id, description } = req.body;

    const sql = `
      UPDATE products
      SET name = ?, category_id = ?, description = ?
      WHERE id = ?
    `;

    await db.query(sql, [name, category_id, description, id]);

    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});


// DELETE
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM products WHERE id = ?', [id]);

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});


// ===== SERVER =====
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});