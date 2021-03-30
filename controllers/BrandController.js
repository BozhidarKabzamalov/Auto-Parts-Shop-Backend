let Brand = require('../models/Brand')
const { Op } = require("sequelize");
let { validationResult } = require('express-validator');

module.exports.getBrand = async (req, res, next) => {
    let brandId = req.params.id

    try {
        let brand = await Brand.findByPk(brandId)

        res.status(200).json({
            brand: brand
        })
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}

module.exports.getBrands = async (req, res, next) => {
    let searchQuery = req.query.searchQuery
    console.log(typeof searchQuery)
    console.log(searchQuery)
    let query = {
        where: [],
        order: [
            ['createdAt', 'DESC']
        ]
    }

    try {
        if (searchQuery !== undefined) {
            query.where.push({
                [Op.substring]: searchQuery
            })
        }
        if (req.query.page) {
            let page = parseInt(req.query.page, 10);

            if (isNaN(page) || page < 1) {
                throw new Error(`Invalid page query "page=${req.query.page}"`);
            }

            let limit = 10;
            query.limit = limit;
            query.offset = (page - 1) * limit;

            let brands = await Brand.findAndCountAll(query);

            res.status(200).json({
                brands: brands.rows,
                totalItems: brands.count,
                totalPages: Math.ceil(brands.count / limit),
            });
        } else {
            let brands = await Brand.findAll(query);

            res.status(200).json({
                brands: brands
            });
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

module.exports.createBrand = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let name = req.body.name

    try {
        let brandExists = await Brand.findOne({
            where: {
                name: name
            }
        })

        if (!brandExists) {
            let brand = await Brand.create({
                name: name
            })

            res.status(200).json({
                brand: brand
            })
        } else {
            res.status(403)
        }
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}

module.exports.deleteBrand = async (req, res, next) => {
    let brandId = req.body.brandId

    try {
        let brand = await Brand.destroy({
            where: {
                id: brandId
            }
        })

        res.status(200).json({
            brand: brand
        })
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}

module.exports.updateBrand = async (req, res, next) => {
    try {
        let brand = await Brand.findByPk(req.body.id)
        brand.name = req.body.name
        brand.save()

        res.status(200).json({
            brand: brand
        })
    } catch (e) {
        console.log(e)
    }
}
