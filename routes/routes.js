var express = require('express');
var router = express.Router();

let partController = require('../controllers/PartController');
let categoryController = require('../controllers/CategoryController');

router.get('/parts/:categoryId', partController.getCategoryParts);

router.get('/categories', categoryController.getCategories);


module.exports = router;
