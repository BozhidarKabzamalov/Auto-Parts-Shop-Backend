let Sequelize = require('sequelize');
let sequelize = require('../controllers/DatabaseController');

let Category = sequelize.define('category', {
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
    image: {
        type: Sequelize.STRING(1400),
        allowNull: false
    }
}, {
    tableName: 'categories'
})

module.exports = Category;
