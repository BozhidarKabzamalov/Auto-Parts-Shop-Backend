let Category = require('../models/Category');
let sharp = require('sharp');
let { v4: uuidv4 } = require('uuid');
let { validationResult } = require('express-validator');
let fs = require('fs').promises;

module.exports.getCategoryById = async (req, res, next) => {
    let categoryId = req.params.id

    try {
        let category = await Category.findByPk(categoryId)

        res.status(200).json({
            category: category
        })
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}

module.exports.getCategories = async (req, res, next) => {
    let query = { order: [['name', 'ASC']] }

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

            try {
                await sharp(file.buffer)
                .resize({ height: 200 })
                .toFile('public/images/categories/' + imageName);
            } catch (e) {
                console.log(e)
            }

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
        let category = await Category.findByPk(categoryId)

        try {
            await category.destroy()
            let folderAndFile = category.image.replace(req.protocol + '://' + req.get('host') + '/images/categories/', '')
            await fs.unlink('public/images/categories/' + folderAndFile)
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

module.exports.updateCategory = async (req, res, next) => {
    try {
        let category = await Category.findByPk(req.body.id)

        category.name = req.body.name

        if (category.image != req.body.image) {
            let oldImage = category.image
            let imageName = uuidv4() + ".png"
            let imageUrl = req.protocol + '://' + req.get('host') + '/images/categories/' + imageName
            category.image = imageUrl

            try {
                await sharp(req.file.buffer)
                .resize({ height: 200 })
                .toFile('public/images/categories/' + imageName);

                let folderAndFile = oldImage.replace(req.protocol + '://' + req.get('host') + '/images/categories/', '')
                await fs.unlink('public/images/categories/' + folderAndFile)
            } catch (e) {
                console.log(e)
            }
        }

        category.save()

        res.status(200).json({
            category: category
        })
    } catch (e) {
        console.log(e)
    }
}
