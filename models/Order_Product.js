let Sequelize = require('sequelize');
let sequelize = require('../controllers/DatabaseController');

let Order_Product = sequelize.define('Order_Product', {
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = Order_Product;
