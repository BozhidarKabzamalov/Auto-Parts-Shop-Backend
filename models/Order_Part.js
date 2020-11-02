let Sequelize = require('sequelize');
let sequelize = require('../controllers/DatabaseController');

let Order_Part = sequelize.define('Order_Part', {
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = Order_Part;
