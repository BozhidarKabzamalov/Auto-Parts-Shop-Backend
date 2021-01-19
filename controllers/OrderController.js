let Order = require('../models/Order')
let Product = require('../models/Product')
let { validationResult } = require('express-validator');

module.exports.getOrders = async (req, res, next) => {
    let orders

    try {
        orders = await Order.findAll({
            include: Product
        })
    } catch (e) {
        console.log(e)
    }

    if (orders) {
        res.status(200).json({
            orders: orders
        })
    } else {
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
    let order

    items.forEach(item => {
        orderToCreate.totalPrice += item.quantity * item.price
    });

    try {
        order = await Order.create(orderToCreate)

        items.forEach(async item => {
            let product = await Product.findByPk(item.id)
            order.addProduct(product, { through: { quantity: item.quantity } })
        })
    } catch (e) {
        console.log(e)
    }

    if (order) {
        res.status(200).json({
            order: order
        })
    } else {
        res.status(500)
    }
}
