var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log('get users');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  setTimeout(() => res.send('respond with a resource'), 5000);
});
router.delete('/del', function(req, res, next) {
  console.log('user is deleted', req.body)
  setTimeout(() => res.send('respond with a resource'), 5000);
})

router.post('/post', function(req, res, next) {
  console.log('user is post', req.body)
  setTimeout(() => res.send('respond with a resource'), 5000);
})

module.exports = router;
