let Sequelize = require('sequelize');
let sequelize = require('../controllers/DatabaseController');

let Order = sequelize.define('order', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = Order;
