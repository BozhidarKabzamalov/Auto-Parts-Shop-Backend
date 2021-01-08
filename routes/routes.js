var express = require('express');
var router = express.Router();
let partController = require('../controllers/PartController');
let categoryController = require('../controllers/CategoryController');
let brandController = require('../controllers/BrandController');
let modelController = require('../controllers/ModelController');
let userController = require('../controllers/UserController');
let orderController = require('../controllers/OrderController');
let { check } = require('express-validator')

router.get('/parts', partController.getParts);

router.get('/parts/:categoryId', partController.getPartsByCategory);

router.get('/parts/:model/:categoryId', partController.getPartsByModelCategory);

router.get('/categories', categoryController.getCategories);

router.get('/brands', brandController.getBrands);

router.get('/models/:brandId/:year', modelController.getModelsByBrandAndYear);

router.get('/orders', orderController.getOrders);

router.get('/createCategory', categoryController.createCategory)

router.post('/createOrder', [
    check('deliveryInformation.firstName').isLength({ min: 2, max: 50 }),
    check('deliveryInformation.lastName').isLength({ min: 2, max: 50 }),
    check('deliveryInformation.phoneNumber').isLength({ min: 2, max: 50 }),
    check('deliveryInformation.email').isEmail(),
    check('deliveryInformation.city').isLength({ min: 2, max: 50 }),
    check('deliveryInformation.zipCode').isLength({ min: 2, max: 50 }),
    check('deliveryInformation.firstName').isLength({ min: 2, max: 50 }),
    check('deliveryInformation.streetAddress').isLength({ min: 2, max: 50 }),
    check('deliveryInformation.extraNotes').isLength({ min: 2, max: 50 }),
], orderController.createOrder);

router.post('/login', userController.loginUser);


module.exports = router;
