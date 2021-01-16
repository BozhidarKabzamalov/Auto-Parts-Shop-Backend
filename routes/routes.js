var express = require('express');
var router = express.Router();
let productController = require('../controllers/ProductController');
let categoryController = require('../controllers/CategoryController');
let brandController = require('../controllers/BrandController');
let modelController = require('../controllers/ModelController');
let userController = require('../controllers/UserController');
let orderController = require('../controllers/OrderController');
let { check } = require('express-validator')

router.get('/products', productController.getProducts);

router.get('/products/:categoryId', productController.getProductsByCategory);

router.get('/products/:model/:categoryId', productController.getProductsByModelCategory);

router.get('/categories', categoryController.getCategories);

router.get('/brands', brandController.getBrands);

router.get('/models/:name', modelController.getModelsByName);

//router.get('/models/:brandId/:year', modelController.getModelsByBrandAndYear);

router.get('/orders', orderController.getOrders);

router.post('/createProduct', productController.createProduct);

router.post('/deleteProduct', productController.deleteProduct);

router.post('/createCategory', categoryController.createCategory);

router.post('/deleteCategory', categoryController.deleteCategory);

router.post('/createBrand', brandController.createBrand);

router.post('/deleteBrand', brandController.deleteBrand);

router.post('/createModel', modelController.createModel);

router.post('/deleteModel', modelController.deleteModel);

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
