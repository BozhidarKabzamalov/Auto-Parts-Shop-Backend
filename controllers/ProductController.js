let Product = require('../models/Product')
let Model = require('../models/Model')
let Jimp = require('jimp');
let { v4: uuidv4 } = require('uuid');

module.exports.createProduct = async (req, res, next) => {
    let name = req.body.name
    let description = req.body.description
    let price = req.body.price
    let manufacturer = req.body.manufacturer
    let serialNumber = req.body.serialNumber
    let categoryId = req.body.categoryId
    let file = req.file
    let imageName = uuidv4() + ".png"
    let imageUrl = req.protocol + '://' + req.get('host') + '/images/products/' + imageName

    Jimp.read(file.buffer)
    .then(image => {
        return image
        .resize(Jimp.AUTO, 200)
        .write('public/images/products/' + imageName);
    })
    .catch(err => {
        console.error(err);
    });

    let product = await Product.create({
        name: name,
        description: description,
        price: price,
        manufacturer: manufacturer,
        serialNumber: serialNumber,
        image: imageUrl,
        categoryId: categoryId
    })

    res.status(200).json({
        product: product
    })
}

module.exports.deleteProduct = async (req, res, next) => {
    let productId = req.body.productId

    await Product.destroy({
        where: {
            id: productId
        }
    })

    res.status(200).json({
        message: "Product successfully deleted"
    })
}

module.exports.getProducts = async (req, res, next) => {
    let page = req.query.page
    let limit = 3
    let offset = ( page - 1 ) * limit

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
}

module.exports.getProductsByCategory = async (req, res, next) => {
    let categoryId = req.params.categoryId
    let page = req.query.page
    let limit = 10
    let offset = ( page - 1 ) * limit

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
}

module.exports.getProductsByModelCategory = async (req, res, next) => {
    let model = req.params.model
    let categoryId = req.params.categoryId
    let page = req.query.page
    let limit = 10
    let offset = ( page - 1 ) * limit

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
}
