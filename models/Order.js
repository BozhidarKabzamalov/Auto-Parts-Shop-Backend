let Sequelize = require('sequelize');
let sequelize = require('../controllers/DatabaseController');

let Order = sequelize.define('order', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },
    zipCode: {
        type: Sequelize.STRING,
        allowNull: false
    },
    streetAddress: {
        type: Sequelize.STRING,
        allowNull: false
    },
    extraNotes: {
        type: Sequelize.STRING,
        allowNull: true
    },
    totalPrice: {
        type: Sequelize.DECIMAL,
        allowNull: false
    },
})

module.exports = Order;
