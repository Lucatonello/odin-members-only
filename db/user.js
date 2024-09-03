// db/user.js
const pool = require('./pool');
const bcryptjs = require('bcryptjs');

const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const createUser = async (email, password) => {
  const hashedPassword = await bcryptjs.hash(password, 10);
  console.log("Creating user with email:", email); // Add this line
  await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
  console.log("User created successfully"); // Add this line
};

module.exports = { getUserByEmail, createUser };
