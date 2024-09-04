const pool = require('./pool');
const bcryptjs = require('bcryptjs');

const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const createUser = async (email, password) => {
  const hashedPassword = await bcryptjs.hash(password, 10);
  await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
};

const makeMember = async (user) => {
  if (user.status !== 'member') {
    await pool.query('UPDATE users SET status = $1 WHERE id = $2', ['member', user.id]);
  }
};

const addStorie = async (storie, author) => {
  await pool.query('INSERT INTO stories (text, authorid) VALUES ($1, $2)', [storie, author.id]);
};

module.exports = { getUserByEmail, createUser, makeMember, addStorie };
