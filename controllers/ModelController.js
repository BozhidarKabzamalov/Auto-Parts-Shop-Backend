let Model = require('../models/Model')
const { Op } = require("sequelize");

module.exports.getModelsByBrandAndYear = async (req, res, next) => {
    let brandId = req.params.brandId
    let year = req.params.year

    let models = await Model.findAll({
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
        models: models
    })
}

module.exports.getModelsByName = async (req, res, next) => {
    let name = req.params.name

    let models = await Model.findAll({
        where: {
            name: {
                [Op.substring]: name
            }
        }
    })

    res.status(200).json({
        models: models
    })
}

module.exports.createModel = async (req, res, next) => {
    let name = req.body.name
    let manufacturedFrom = req.body.manufacturedFrom
    let manufacturedTo = req.body.manufacturedTo
    let brandId = req.body.brandId

    let model = await Model.create({
        name: name,
        manufacturedFrom: manufacturedFrom,
        manufacturedTo: manufacturedTo,
        brandId: brandId
    })

    res.status(200).json({
        model: model
    })
}

module.exports.deleteModel = async (req, res, next) => {
    let modelId = req.body.modelId

    await Model.destroy({
        where: {
            id: modelId
        }
    })

    res.status(200).json({
        message: "Model successfully deleted"
    })
}
