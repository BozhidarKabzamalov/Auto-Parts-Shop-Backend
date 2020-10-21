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
    },
    parent_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'categories'
})

module.exports = Category;
