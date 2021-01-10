let Order = require('../models/Order')
let Part = require('../models/Part')
let { validationResult } = require('express-validator');

module.exports.getOrders = async (req, res, next) => {
    let orders = await Order.findAll({
        include: Part
    })

    res.status(200).json({
        orders: orders
    })
}

module.exports.createOrder = async (req, res, next) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(401).json({
            message: 'Authentication failed'
        })
    }

    let firstName = req.body.deliveryInformation.firstName
    let lastName = req.body.deliveryInformation.lastName
    let phoneNumber = req.body.deliveryInformation.phoneNumber
    let email = req.body.deliveryInformation.email
    let city = req.body.deliveryInformation.city
    let zipCode = req.body.deliveryInformation.zipCode
    let streetAddress = req.body.deliveryInformation.streetAddress
    let extraNotes = req.body.deliveryInformation.extraNotes
    let items = req.body.items
    let totalPrice = 0

    items.forEach(item => {
        totalPrice += item.quantity * item.price
    });

    let order = await Order.create({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        email: email,
        city: city,
        zipCode: zipCode,
        streetAddress: streetAddress,
        extraNotes: extraNotes,
        totalPrice: totalPrice
    })

    items.forEach(item => {
        Part.findByPk(item.id)
        .then(result => {
            order.addPart(result, { through: { quantity: item.quantity } })
        })
        .catch(error => {
            console.log(error)
        })
    });

    res.status(200).json({
        order: order
    })
}
