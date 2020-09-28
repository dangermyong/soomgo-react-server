const express = require("express");
const router = express.Router();
const pool = require('../utils/mysql.js');
const { requireAuth } = require('../utils/authMiddleware.js')
require('dotenv').config();

router.get('/sent', requireAuth, async (req, res, next) => {
  try{
    console.log(req.token.id)
    const connection = await pool.getConnection();
    const [user] = await connection.query('SELECT * FROM USER_TB WHERE id = ?', [req.token.id]);
    const [results] = await connection.query('SELECT * FROM REQUEST_TB WHERE userId = ?', [req.token.id])
    const promises = results.map(async result => {
      const [estimates] = await connection.query('SELECT * FROM ESTIMATES_TB JOIN GOSU_TB ON ESTIMATES_TB.gosuId = GOSU_TB.id WHERE ESTIMATES_TB.requestId = ?', result.id)
      return ({
        ...result,
        estimates: estimates
      })
    })
    const newResults = await Promise.all(promises)
    console.log(newResults)
    connection.release()
    res.status(200).json({ userName: req.token.name , results: newResults});
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg : '리퀘스트 에러가 났어요!'});
  }
});

module.exports = router;