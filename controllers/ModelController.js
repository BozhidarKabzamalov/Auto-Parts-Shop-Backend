let Model = require('../models/Model')
const { Op } = require("sequelize");

module.exports.getModelsByBrandAndYear = async (req, res, next) => {
    let brandId = req.params.brandId
    let year = req.params.year

    let response = await Model.findAll({
        where: {
            brandId: brandId,
            manufacturedFrom: {
                [Op.lte]: year
            },
            manufacturedTo: {
                [Op.or]: {
                    [Op.gte]: year,
                    [Op.eq]: null
               }
           }
        }
    })

    res.status(200).json({
        models: response
    })
}
