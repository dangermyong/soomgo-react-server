const express = require("express");
const router = express.Router();
const pool = require('../utils/mysql.js');
const { requireAuth } = require('../utils/authMiddleware.js')
require('dotenv').config();

router.post('/sent', async (req, res, next) => {
  try{
    const id = req.body.id
    console.log(id)
    const connection = await pool.getConnection();
    const [user] = await connection.query('SELECT * FROM USER_TB WHERE id = ?', [id]);
    const [results] = await connection.query('SELECT * FROM REQUEST_TB WHERE userId = ?', [id])
    const promises = results.map(async result => {
      const [estimates] = await connection.query('SELECT * FROM ESTIMATES_TB JOIN GOSU_TB ON ESTIMATES_TB.gosuId = GOSU_TB.id WHERE ESTIMATES_TB.requestId = ?', [result.id])
      return ({
        ...result,
        estimates: estimates
      })
    })
    const newResults = await Promise.all(promises)
    console.log(newResults)
    connection.release()
    res.status(200).json({ results: newResults});
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg : '리퀘스트 에러가 났어요!'})
  }
});


router.get('/quotes/:requestId', async (req, res, next) => {
  try{
    const id = req.body.id
    console.log(id)
    const connection = await pool.getConnection();
    const [user] = await connection.query('SELECT * FROM USER_TB WHERE id = ?', [id]);
    const [results] = await connection.query('SELECT * FROM REQUEST_TB WHERE id = ?', req.params.requestId)
    const promises = results.map(async result => {
      const [estimates] = await connection.query('SELECT * FROM ESTIMATES_TB JOIN GOSU_TB ON ESTIMATES_TB.gosuId = GOSU_TB.id WHERE ESTIMATES_TB.requestId = ?', req.params.requestId)
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
    res.status(500).json({ msg : '쿼트 에러가 났어요!'});
  }
});

module.exports = router;