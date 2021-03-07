let Order = require('../models/Order')
let Product = require('../models/Product')
let { validationResult } = require('express-validator');

module.exports.getOrders = async (req, res, next) => {
    let page = req.query.page
    let limit = 10
    let offset = ( page - 1 ) * limit

    try {
        let orders = await Order.findAndCountAll({
            include: Product,
            limit: limit,
            offset: offset,
            order: [
                ['createdAt', 'DESC']
            ]
        })

        let pages = Math.ceil( orders.count / limit )

        res.status(200).json({
            orders: orders.rows,
            totalItems: orders.count,
            totalPages: pages,
        })
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}

module.exports.createOrder = async (req, res, next) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(401).json({
            message: 'Authentication failed'
        })
    }

    let orderToCreate = {
        firstName: req.body.deliveryInformation.firstName,
        lastName: req.body.deliveryInformation.lastName,
        phoneNumber: req.body.deliveryInformation.phoneNumber,
        email: req.body.deliveryInformation.email,
        city: req.body.deliveryInformation.city,
        zipCode: req.body.deliveryInformation.zipCode,
        streetAddress: req.body.deliveryInformation.streetAddress,
        extraNotes: req.body.deliveryInformation.extraNotes,
        totalPrice: 0
    }
    let items = req.body.items

    items.forEach(item => {
        if (item.discount === 0) {
            orderToCreate.totalPrice += item.quantity * item.price
        } else {
            let discountPrice = item.price - ( item.price * item.discount / 100 )
            orderToCreate.totalPrice += item.quantity * discountPrice
        }
    });

    try {
        let order = await Order.create(orderToCreate)

        items.forEach(async item => {
            let product = await Product.findByPk(item.id)
            order.addProduct(product, { through: { quantity: item.quantity } })
        })

        res.status(200).json({
            order: order
        })
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}
