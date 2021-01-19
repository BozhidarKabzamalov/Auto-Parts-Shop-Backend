let Model = require('../models/Model')
const { Op } = require("sequelize");

module.exports.getModels = async (req, res, next) => {
    let models

    try {
        models = await Model.findAll()
    } catch (e) {
        console.log(e)
    }

    if (models) {
        res.status(200).json({
            models: models
        })
    } else {
        res.status(500)
    }
}

module.exports.getModelsByBrandAndYear = async (req, res, next) => {
    let brandId = req.params.brandId
    let year = req.params.year
    let models

    try {
        models = await Model.findAll({
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
    } catch (e) {
        console.log(e)
    }

    if (models) {
        res.status(200).json({
            models: models
        })
    } else {
        res.status(500)
    }
}

module.exports.getModelsByName = async (req, res, next) => {
    let name = req.params.name
    let models

    try {
        models = await Model.findAll({
            where: {
                name: {
                    [Op.substring]: name
                }
            }
        })
    } catch (e) {
        console.log(e)
    }

    if (models) {
        res.status(200).json({
            models: models
        })
    } else {
        res.status(500)
    }
}

module.exports.createModel = async (req, res, next) => {
    let name = req.body.name
    let manufacturedFrom = req.body.manufacturedFrom
    let manufacturedTo = req.body.manufacturedTo
    let brandId = req.body.brandId
    let modelExists
    let model

    try {
        modelExists = await Model.findOne({
            where: {
                name: name
            }
        })

        if (!modelExists) {
            model = await Model.create({
                name: name,
                manufacturedFrom: manufacturedFrom,
                manufacturedTo: manufacturedTo,
                brandId: brandId
            })
        } else {
            res.status(403)
        }
    } catch (e) {
        console.log(e)
    }

    if (model) {
        res.status(200).json({
            model: model
        })
    } else {
        res.status(500)
    }
}

module.exports.deleteModel = async (req, res, next) => {
    let modelId = req.body.modelId
    let model

    try {
        model = await Model.destroy({
            where: {
                id: modelId
            }
        })
    } catch (e) {
        console.log(e)
    }

    if (model) {
        res.status(200).json({
            model: model
        })
    } else {
        res.status(500)
    }
}
