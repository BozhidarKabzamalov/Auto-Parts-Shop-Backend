var express = require('express');
var router = express.Router();
let productController = require('../controllers/ProductController');
let categoryController = require('../controllers/CategoryController');
let brandController = require('../controllers/BrandController');
let modelController = require('../controllers/ModelController');
let userController = require('../controllers/UserController');
let orderController = require('../controllers/OrderController');
let authenticated = require('../middleware/authenticated');
let { check } = require('express-validator')

router.get('/products', productController.getProducts);

router.get('/products/:categoryId', productController.getProductsByCategory);

router.get('/products/:model/:categoryId', productController.getProductsByModelCategory);

router.get('/categories', categoryController.getCategories);

router.get('/brands', brandController.getBrands);

router.get('/brands/:name', brandController.getBrandsByName);

router.get('/models', modelController.getModels);

router.get('/models/:name', modelController.getModelsByName);

router.get('/models/:brandId/:year', modelController.getModelsByBrandAndYear);

router.get('/orders', authenticated, orderController.getOrders);

router.post('/createProduct', authenticated, productController.createProduct);

router.post('/deleteProduct', authenticated, productController.deleteProduct);

router.post('/createCategory', authenticated, [
    check('name').not().isEmpty().isLength({ min: 1, max: 255 }),
    check('image').not().isEmpty().isLength({ min: 1, max: 1400 }),
], categoryController.createCategory);

router.post('/deleteCategory', authenticated, categoryController.deleteCategory);

router.post('/createBrand', authenticated, [
    check('name').not().isEmpty().isLength({ min: 1, max: 255 })
], brandController.createBrand);

router.post('/deleteBrand', authenticated, brandController.deleteBrand);

router.post('/createModel', authenticated, [
    check('name').not().isEmpty().isLength({ min: 1, max: 255 }),
], modelController.createModel);

router.post('/deleteModel', authenticated, modelController.deleteModel);

router.post('/createOrder', [
    check('deliveryInformation.firstName').not().isEmpty().isLength({ min: 1, max: 255 }),
    check('deliveryInformation.lastName').not().isEmpty().isLength({ min: 1, max: 255 }),
    check('deliveryInformation.phoneNumber').not().isEmpty().isLength({ min: 1, max: 255 }),
    check('deliveryInformation.email').isEmail().isLength({ min: 1, max: 255 }),
    check('deliveryInformation.city').not().isEmpty().isLength({ min: 1, max: 255 }),
    check('deliveryInformation.zipCode').not().isEmpty().isLength({ min: 1, max: 255 }),
    check('deliveryInformation.streetAddress').not().isEmpty().isLength({ min: 1, max: 255 }),
    check('deliveryInformation.extraNotes').isLength({ min: 1, max: 50 }),
], orderController.createOrder);

router.post('/login', userController.loginUser);


module.exports = router;
