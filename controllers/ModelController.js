let Model = require('../models/Model')
const { Op } = require("sequelize");
let { validationResult } = require('express-validator');

module.exports.getModels = async (req, res, next) => {
    let query = {order: [['createdAt', 'DESC']]};

    try {
        if (req.query.page) {
            let page = parseInt(req.query.page, 10);

            if (isNaN(page) || page < 1) {
                throw new Error(`Invalid page query "page=${req.query.page}"`);
            }

            let limit = 10
            query.limit = limit
            query.offset = ( page - 1 ) * limit

            let models = await Model.findAndCountAll(query)

            res.status(200).json({
                models: models.rows,
                totalItems: models.count,
                totalPages: Math.ceil( models.count / limit )
            })
        } else {
            let models = await Model.findAll(query)

            res.status(200).json({
                models: models
            })
        }
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}

module.exports.getModelsByBrandAndYear = async (req, res, next) => {
    let brandId = req.params.brandId
    let year = req.params.year

    try {
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
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}

module.exports.getModelsByName = async (req, res, next) => {
    let name = req.params.name

    try {
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
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}

module.exports.createModel = async (req, res, next) => {
    let name = req.body.name
    let manufacturedFrom = req.body.manufacturedFrom
    let manufacturedTo = req.body.manufacturedTo
    let brandId = req.body.brandId

    try {
        let modelExists = await Model.findOne({
            where: {
                name: name
            }
        })

        if (!modelExists) {
            let model = await Model.create({
                name: name,
                manufacturedFrom: manufacturedFrom,
                manufacturedTo: manufacturedTo,
                brandId: brandId
            })

            res.status(200).json({
                model: model
            })
        } else {
            res.status(403)
        }
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}

module.exports.deleteModel = async (req, res, next) => {
    let modelId = req.body.modelId

    try {
        let model = await Model.destroy({
            where: {
                id: modelId
            }
        })

        res.status(200).json({
            model: model
        })
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}

module.exports.updateModel = async (req, res, next) => {
    let modelId = req.body.modelId

    try {
        let model = await Model.findByPk(modelId)

        model.save()

        res.status(200).json({
            server: server
        })
    } catch (e) {
        console.log(e)
    }
}
