let Category = require('../models/Category')
let Jimp = require('jimp');
let { v4: uuidv4 } = require('uuid');
let { validationResult } = require('express-validator');
let fs = require('fs').promises;

module.exports.getCategories = async (req, res, next) => {
    let query = { order: [['createdAt', 'DESC']] }

    try {
        if (req.query.page) {
            const page = parseInt(req.query.page, 10);

            if (isNaN(page) || page < 1) {
                throw new Error(`Invalid page query "page=${req.query.page}"`);
            }

            let limit = 10
            query.limit = limit
            query.offset = ( page - 1 ) * limit

            let categories = await Category.findAndCountAll(query)

            res.status(200).json({
                totalItems: categories.count,
                totalPages: Math.ceil( categories.count / limit ),
                categories: categories.rows
            })
        } else {
            categories = await Category.findAll(query)

            res.status(200).json({
                categories: categories
            })
        }
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}

module.exports.createCategory = async (req, res, next) => {
    let name = req.body.name
    let file = req.file
    let imageName = uuidv4() + ".png"
    let imageUrl = req.protocol + '://' + req.get('host') + '/images/categories/' + imageName

    try {
        let categoryExists = await Category.findOne({
            where: {
                name: name
            }
        })

        if (!categoryExists) {
            let category = await Category.create({
                name: name,
                image: imageUrl
            })

            Jimp.read(file.buffer)
            .then(image => {
                return image
                .resize(Jimp.AUTO, 200)
                .write('public/images/categories/' + imageName);
            })
            .catch(err => {
                console.error(err);
            })

            res.status(200).json({
                category: category
            })
        } else {
            res.status(403)
        }
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}

module.exports.deleteCategory = async (req, res, next) => {
    let categoryId = req.body.categoryId

    try {
        let category = await Category.destroy({
            where: {
                id: categoryId
            }
        })

        try {
            await fs.unlink('public/images/categories/28df6bfb-ad82-4fb5-92c1-45db27567982.png')
        } catch (e) {
            console.log(e)
        }

        res.status(200).json({
            category: category
        })
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}
