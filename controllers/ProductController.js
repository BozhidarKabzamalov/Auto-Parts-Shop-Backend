let Product = require('../models/Product')
let Model = require('../models/Model')
let Brand = require('../models/Brand')
let Jimp = require('jimp');
let { v4: uuidv4 } = require('uuid');

module.exports.createProduct = async (req, res, next) => {
    let imageName = uuidv4() + ".png"
    let productToCreate = {
        name: req.body.name,
        description: req.body.description,
        price: parseInt(req.body.price),
        manufacturer: req.body.manufacturer,
        serialNumber: req.body.serialNumber,
        image: req.protocol + '://' + req.get('host') + '/images/products/' + imageName,
        categoryId: req.body.categoryId,
    }
    let brandsIds = JSON.parse(req.body.brands)
    let modelsIds = JSON.parse(req.body.models)
    let productExists
    let product
    let models
    let brands

    try {
        productExists = await Product.findOne({
            where: {
                name: productToCreate.name
            }
        })

        if (!productExists) {
            product = await Product.create(productToCreate)
        } else {
            res.status(403)
        }

        models = await Model.findAll({
            where: {
                id: modelsIds
            }
        });

        brands = await Brand.findAll({
            where: {
                id: brandsIds
            }
        });
    } catch (e) {
        console.log(e)
    }

    if (product) {
        if (models && brands) {
            models.forEach((model, i) => {
                model.addProduct(product)
            })

            brands.forEach((brand, i) => {
                brand.addProduct(product)
            })
        } else {
            res.status(500)
        }

        let file = req.file

        if (file) {
            Jimp.read(file.buffer)
            .then(image => {
                return image
                .resize(Jimp.AUTO, 200)
                .write('public/images/products/' + imageName);
            })
            .catch(err => {
                console.error(err);
            });
        }

        res.status(200).json({
            product: product
        })
    } else {
        res.status(500)
    }

}

module.exports.deleteProduct = async (req, res, next) => {
    let productId = req.body.productId
    let product

    try {
        product = await Product.destroy({
            where: {
                id: productId
            }
        })
    } catch (e) {
        console.log(e)
    }

    if (product) {
        res.status(200).json({
            product: product
        })
    } else {
        res.status(500)
    }
}

module.exports.getProducts = async (req, res, next) => {
    let page = req.query.page
    let limit = 3
    let offset = ( page - 1 ) * limit
    let products

    try {
        products = await Product.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [
                ['createdAt', 'DESC']
            ]
        })
    } catch (e) {
        console.log(e)
    }

    if (products) {
        let pages = Math.ceil( products.count / limit )

        res.status(200).json({
            totalItems: products.count,
            totalPages: pages,
            products: products.rows
        })
    } else {
        res.status(500)
    }
}

module.exports.getProductsByCategory = async (req, res, next) => {
    let categoryId = req.params.categoryId
    let page = req.query.page
    let limit = 10
    let offset = ( page - 1 ) * limit
    let products

    try {
        products = await Product.findAndCountAll({
            limit: limit,
            offset: offset,
            where: {
                categoryId: categoryId
            }
        })
    } catch (e) {
        console.log(e)
    }

    if (products) {
        let pages = Math.ceil( products.count / limit )

        res.status(200).json({
            totalItems: products.count,
            totalPages: pages,
            products: products.rows
        })
    } else {
        res.status(500)
    }
}

module.exports.getProductsByModelCategory = async (req, res, next) => {
    let model = req.params.model
    let categoryId = req.params.categoryId
    let page = req.query.page
    let limit = 10
    let offset = ( page - 1 ) * limit
    let products

    try {
        products = await Product.findAndCountAll({
            limit: limit,
            offset: offset,
            where: {
                categoryId: categoryId
            },
            include: {
                model: Model,
                where: {
                    name: model
                }
            }
        })
    } catch (e) {
        console.log(e)
    }

    if (products) {
        let pages = Math.ceil( products.count / limit )

        res.status(200).json({
            totalItems: products.count,
            totalPages: pages,
            products: products.rows
        })
    } else {
        res.status(500)
    }
}
