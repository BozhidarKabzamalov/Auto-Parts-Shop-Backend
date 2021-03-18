let Product = require('../models/Product');
let Model = require('../models/Model');
let Brand = require('../models/Brand');
let sharp = require('sharp');
let { v4: uuidv4 } = require('uuid');
let { validationResult } = require('express-validator');
let fs = require('fs').promises;

module.exports.createProduct = async (req, res, next) => {
    let imageName = uuidv4() + ".png"
    let productToCreate = {
        name: req.body.name,
        description: req.body.description,
        price: parseInt(req.body.price),
        discount: parseInt(req.body.discount),
        manufacturer: req.body.manufacturer,
        serialNumber: req.body.serialNumber,
        image: req.protocol + '://' + req.get('host') + '/images/products/' + imageName,
        categoryId: req.body.categoryId,
    }
    let brandsIds = JSON.parse(req.body.brands)
    let modelsIds = JSON.parse(req.body.models)

    try {
        let productExists = await Product.findOne({
            where: {
                name: productToCreate.name
            }
        })

        if (!productExists) {
            let product = await Product.create(productToCreate)

            let models = await Model.findAll({
                where: {
                    id: modelsIds
                }
            });

            let brands = await Brand.findAll({
                where: {
                    id: brandsIds
                }
            });

            models.forEach((model, i) => {
                model.addProduct(product)
            })

            brands.forEach((brand, i) => {
                brand.addProduct(product)
            })

            let file = req.file

            try {
                await sharp(file.buffer)
                .resize({ height: 200 })
                .toFile('public/images/products/' + imageName);
            } catch (e) {
                console.log(e)
            }

            res.status(200).json({
                product: product
            })
        } else {
            res.status(403)
        }
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}

module.exports.deleteProduct = async (req, res, next) => {
    let productId = req.body.productId

    try {
        let product = await Product.findByPk(productId)

        try {
            await product.destroy()
            let folderAndFile = product.image.replace(req.protocol + '://' + req.get('host') + '/images/products/', '')
            await fs.unlink('public/images/products/' + folderAndFile)
        } catch (e) {
            console.log(e)
        }

        res.status(200).json({
            product: product
        })
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}

module.exports.getProduct = async (req, res, next) => {
    let productId = req.params.id

    try {
        let product = await Product.findByPk(productId)

        res.status(200).json({
            product: product
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports.getProducts = async (req, res, next) => {
    let page = parseInt(req.query.page, 10)
    let limit = 10
    let offset = ( page - 1 ) * limit

    try {
        let products = await Product.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [
                ['createdAt', 'DESC']
            ]
        })

        let pages = Math.ceil( products.count / limit )

        res.status(200).json({
            totalItems: products.count,
            totalPages: pages,
            products: products.rows
        })
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}

module.exports.getProductsByCategory = async (req, res, next) => {
    let categoryId = req.params.categoryId
    let page = parseInt(req.query.page, 10)
    let limit = 10
    let offset = ( page - 1 ) * limit

    try {
        let products = await Product.findAndCountAll({
            limit: limit,
            offset: offset,
            where: {
                categoryId: categoryId
            }
        })

        let pages = Math.ceil( products.count / limit )

        res.status(200).json({
            totalItems: products.count,
            totalPages: pages,
            products: products.rows
        })
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}

module.exports.getProductsByModelCategory = async (req, res, next) => {
    let model = req.params.model
    let categoryId = req.params.categoryId
    let page = parseInt(req.query.page, 10)
    let limit = 10
    let offset = ( page - 1 ) * limit

    try {
        let products = await Product.findAndCountAll({
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

        let pages = Math.ceil( products.count / limit )

        res.status(200).json({
            totalItems: products.count,
            totalPages: pages,
            products: products.rows
        })
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}

module.exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findByPk(req.body.id)
        product.save()

        res.status(200).json({
            product: product
        })
    } catch (e) {
        console.log(e)
    }
}
