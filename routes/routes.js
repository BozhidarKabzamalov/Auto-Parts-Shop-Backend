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

router.get('/product/:id', productController.getProduct);

router.get('/products/:categoryId', productController.getProductsByCategory);

router.get('/products/:model/:categoryId', productController.getProductsByModelCategory);

router.get('/categories', categoryController.getCategories);

router.get('/brands', brandController.getBrands);

router.get('/brands/:name', brandController.getBrandsByName);

router.get('/models', modelController.getModels);

router.get('/models/:name', modelController.getModelsByName);

router.get('/models/:brandId/:year', modelController.getModelsByBrandAndYear);

router.get('/orders', authenticated, orderController.getOrders);

router.post('/createProduct', authenticated, [
    check('name').not().isEmpty().isLength({ min: 1, max: 255 }),
    check('description').not().isEmpty().isLength({ min: 1, max: 255 }),
    check('price').not().isEmpty().isLength({ min: 1, max: 9999 }),
    check('discount').not().isEmpty().isLength({ min: 1, max: 100 }),
    check('manufacturer').not().isEmpty().isLength({ min: 1, max: 255 }),
    check('serialNumber').not().isEmpty().isLength({ min: 1, max: 255 }),
    check('file').not().isEmpty(),
    check('categoryId').not().isEmpty().isLength({ min: 1 }),
], productController.createProduct);

router.post('/deleteProduct', authenticated, [
    check('modeId').not().isEmpty().isLength({ min: 1 })
], productController.deleteProduct);

router.post('/createCategory', authenticated, [
    check('name').not().isEmpty().isLength({ min: 1, max: 255 }),
    check('image').not().isEmpty(),
], categoryController.createCategory);

router.post('/deleteCategory', authenticated, [
    check('categoryId').not().isEmpty().isLength({ min: 1 })
], categoryController.deleteCategory);

router.post('/createBrand', authenticated, [
    check('name').not().isEmpty().isLength({ min: 1, max: 255 })
], brandController.createBrand);

router.post('/deleteBrand', authenticated, [
    check('brandId').not().isEmpty().isLength({ min: 1 })
], brandController.deleteBrand);

router.post('/createModel', authenticated, [
    check('name').not().isEmpty().isLength({ min: 1, max: 255 }),
], modelController.createModel);

router.post('/deleteModel', authenticated, [
    check('modelId').not().isEmpty().isLength({ min: 1 })
], modelController.deleteModel);

router.post('/createOrder', [
    check('deliveryInformation.firstName').not().isEmpty().isLength({ min: 1, max: 255 }),
    check('deliveryInformation.lastName').not().isEmpty().isLength({ min: 1, max: 255 }),
    check('deliveryInformation.phoneNumber').not().isEmpty().isLength({ min: 1, max: 255 }),
    check('deliveryInformation.email').isEmail().isLength({ min: 1, max: 255 }),
    check('deliveryInformation.city').not().isEmpty().isLength({ min: 1, max: 255 }),
    check('deliveryInformation.zipCode').not().isEmpty().isLength({ min: 1, max: 255 }),
    check('deliveryInformation.streetAddress').not().isEmpty().isLength({ min: 1, max: 255 }),
    check('deliveryInformation.extraNotes').isLength({ min: 1, max: 255 }),
], orderController.createOrder);

router.post('/login', [
    check('username').not().isEmpty().isLength({ min: 1, max: 255 }),
    check('password').not().isEmpty().isLength({ min: 1, max: 255 }),
], userController.loginUser);


module.exports = router;
