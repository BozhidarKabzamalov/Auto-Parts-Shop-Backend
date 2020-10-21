var express = require('express');
var router = express.Router();

let categoryController = require('../controllers/CategoryController');

router.get('/', function(req, res, next) {
    res.send('hi')
});

router.get('/categories', categoryController.getCategories);
router.get('/category/:categoryId', categoryController.getCategory);

module.exports = router;
