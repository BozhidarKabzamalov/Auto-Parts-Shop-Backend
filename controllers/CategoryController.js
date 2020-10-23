let Category = require('../models/Category')
let Part = require('../models/Part')

module.exports.getCategories = (req, res, next) => {
    Category.findAll({
        where: {
            'parent_id': 0
        }
    })
    .then(result => {
        res.send(result)
    })
    .catch(error => {
        console.log(error)
    })
}
