let Model = require('../models/Model')
const { Op } = require("sequelize");

module.exports.getModels = async (req, res, next) => {
    let brandId = req.query.brandId
    let year = req.query.year

    let response = await Model.findAll({
        where: {
            brandId: brandId,
            manufacturedFrom: {
                [Op.lte]: year
            },
            manufacturedTo: {
                [Op.gte]: year
            }
        }
    })

    res.status(200).json({
        models: response
    })
}
