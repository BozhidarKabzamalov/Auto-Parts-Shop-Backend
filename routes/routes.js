var express = require('express');
var router = express.Router();

let partController = require('../controllers/PartController');
let categoryController = require('../controllers/CategoryController');
let brandController = require('../controllers/BrandController');
let modelController = require('../controllers/ModelController');

router.get('/parts/:categoryId', partController.getCategoryParts);

router.get('/categories', categoryController.getCategories);

router.get('/brands', brandController.getBrands);

router.get('/models', modelController.getModels);


module.exports = router;
