let Brand = require('../models/Brand')

module.exports.getBrands = async (req, res, next) => {
    let brands = await Brand.findAll()

    res.status(200).json({
        brands: brands
    })
}

module.exports.createBrand = async (req, res, next) => {
    let name = req.body.name

    let brand = await Brand.create({
        name: name
    })

    res.status(200).json({
        brand: brand
    })
}

module.exports.deleteBrand = async (req, res, next) => {
    let brandId = req.body.brandId

    await Brand.destroy({
        where: {
            id: brandId
        }
    })

    res.status(200).json({
        message: "Brand successfully deleted"
    })
}
