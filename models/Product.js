let Sequelize = require('sequelize');
let sequelize = require('../controllers/DatabaseController');

let Product = sequelize.define('product', {
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
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    discount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    manufacturer: {
        type: Sequelize.STRING,
        allowNull: false
    },
    serialNumber: {
        type: Sequelize.STRING,
        allowNull: false
    },
    image: {
        type: Sequelize.STRING(1400),
        allowNull: false
    }
})

module.exports = Product;
