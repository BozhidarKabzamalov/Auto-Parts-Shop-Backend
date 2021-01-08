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

module.exports.createCategory = (req, res, next) => {
    let name = 'Test'
    let image = 'https://media.discordapp.net/attachments/747469246170398824/771515998405918730/placeholder.png'

    let category = Category.create({
        name: name,
        image: image
    })
    .then(result => {
        res.send(result)
    })
    .catch(error => {
        console.log(error)
    })  
}
