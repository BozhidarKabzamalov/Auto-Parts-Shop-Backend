let Sequelize = require('sequelize');
let sequelize = require('../controllers/DatabaseController');

let Subcategory = sequelize.define('Subcategory', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    tableName: 'subcategories'
})

module.exports = Subcategory;
