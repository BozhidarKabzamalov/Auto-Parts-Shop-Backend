let Brand = require('../models/Brand')
const { Op } = require("sequelize");
let { validationResult } = require('express-validator');

module.exports.getBrands = async (req, res, next) => {
    let brands

    try {
        brands = await Brand.findAll()
    } catch (e) {
        console.log(e)
    }

    if (brands) {
        res.status(200).json({
            brands: brands
        })
    } else {
        res.status(500)
    }
}

module.exports.getBrandsByName = async (req, res, next) => {
    let name = req.params.name
    let brands

    try {
        brands = await Brand.findAll({
            where: {
                name: {
                    [Op.substring]: name
                }
            }
        })
    } catch (e) {
        console.log(e)
    }

    if (brands) {
        res.status(200).json({
            brands: brands
        })
    } else {
        res.status(500)
    }
}

module.exports.createBrand = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let name = req.body.name
    let brandExists
    let brand

    try {
        brandExists = await Brand.findOne({
            where: {
                name: name
            }
        })

        if (!brandExists) {
            brand = await Brand.create({
                name: name
            })
        } else {
            res.status(403)
        }
    } catch (e) {
        console.log(e)
    }

    if (brand) {
        res.status(200).json({
            brand: brand
        })
    } else {
        res.status(500)
    }
}

module.exports.deleteBrand = async (req, res, next) => {
    let brandId = req.body.brandId
    let brand

    try {
        brand = await Brand.destroy({
            where: {
                id: brandId
            }
        })
    } catch (e) {
        console.log(e)
    }

    if (brand) {
        res.status(200).json({
            brand: brand
        })
    } else {
        res.status(500)
    }
}
