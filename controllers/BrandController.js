let Brand = require('../models/Brand')

module.exports.getBrands = async (req, res, next) => {
    let response = await Brand.findAll()

    res.status(200).json({
        brands: response
    })
}
