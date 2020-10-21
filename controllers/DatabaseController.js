let Sequelize = require('sequelize');

let sequelize = new Sequelize('auto_parts_shop', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost',
    logging: false
});

module.exports = sequelize;
