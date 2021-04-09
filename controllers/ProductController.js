let Product = require('../models/Product');
let Model = require('../models/Model');
let Brand = require('../models/Brand');
let sharp = require('sharp');
let { v4: uuidv4 } = require('uuid');
let { validationResult } = require('express-validator');
let fs = require('fs').promises;
let { Op } = require("sequelize");

module.exports.getProductById = async (req, res, next) => {
    let productId = req.params.id

    try {
        let product = await Product.findByPk(productId,{
            include: [
                {
                    model: Model
                },
                {
                    model: Brand
                }
            ]
        })

        let category = await product.getCategory()
        let similarProducts = await category.getProducts({
            where: {
                id: {
                    [Op.not]: product.id
                }
            },
            limit: 4
        })

        product = product.toJSON()
        product.similarProducts = similarProducts
        product.category = category

        res.status(200).json({
            product: product
        })
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}

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

            product.setModels(modelsIds)
            product.setBrands(brandsIds)

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

module.exports.getProducts = async (req, res, next) => {
    let searchQuery = req.query.searchQuery
    if (searchQuery === 'undefined') searchQuery = undefined;
    let categoryId = req.query.categoryId
    if (categoryId === 'undefined') categoryId = undefined;
    let model = req.query.model
    if (model === 'undefined') model = undefined;
    let page = parseInt(req.query.page, 10)
    let limit = 10
    let offset = ( page - 1 ) * limit
    let query = {
        limit: limit,
        offset: offset,
        where: [],
        include: [],
        order: [
            ['createdAt', 'DESC']
        ]
    }

    try {
        if (searchQuery !== undefined) {
            query.where.push({
                [Op.or]: [
                    { name: {
                        [Op.substring]: searchQuery
                    }},
                    { serialNumber: {
                        [Op.substring]: searchQuery
                    }}
                ]
            })
        }
        if (categoryId !== undefined) {
            query.where.push({
                categoryId: categoryId
            })
        }
        if (model !== undefined) {
            query.include.push({
                model: Model,
                where: {
                    name: model
                }
            })
        }

        let products = await Product.findAndCountAll(query)

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

        product.name = req.body.name
        product.description = req.body.description
        product.price = req.body.price
        product.discount = req.body.discount
        product.manufacturer = req.body.manufacturer
        product.serialNumber = req.body.serialNumber
        product.categoryId = req.body.categoryId

        if (product.image != req.body.image) {
            let oldImage = product.image
            let imageName = uuidv4() + ".png"
            let imageUrl = req.protocol + '://' + req.get('host') + '/images/products/' + imageName
            product.image = imageUrl

            try {
                await sharp(req.file.buffer)
                .resize({ height: 200 })
                .toFile('public/images/products/' + imageName);

                let folderAndFile = oldImage.replace(req.protocol + '://' + req.get('host') + '/images/products/', '')
                await fs.unlink('public/images/products/' + folderAndFile)
            } catch (e) {
                console.log(e)
            }
        }

        let brandsIds = JSON.parse(req.body.brands)
        let modelsIds = JSON.parse(req.body.models)

        product.setModels(modelsIds)
        product.setBrands(brandsIds)

        product.save()

        res.status(200).json({
            product: product
        })
    } catch (e) {
        console.log(e)
    }
}
