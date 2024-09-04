const pool = require('./pool');
const bcryptjs = require('bcryptjs');

const getCurrentDateTime = () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const year = now.getFullYear();
  const hour = now.getHours();
  const minute = now.getMinutes();

  const formattedMinute = minute < 10 ? `0${minute}` : minute;

  return `${month}/${day}/${year} at ${hour}:${formattedMinute}`;
};

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
  await pool.query('INSERT INTO stories (text, authorid, date) VALUES ($1, $2, $3)', [storie, author.id, getCurrentDateTime()]);
};

const getStories = async () => {
  const stories = await pool.query(`
        SELECT stories.text, users.email, stories.date
        FROM stories
        JOIN users ON stories.authorid = users.id
    `);
  return stories;
};

module.exports = { getUserByEmail, createUser, makeMember, addStorie, getStories };
