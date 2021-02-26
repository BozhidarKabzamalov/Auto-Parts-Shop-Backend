let User = require('../models/User');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let { validationResult } = require('express-validator');

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let username = req.body.username
    let password = req.body.password

    try {
        let userExists = await User.findOne({
            where: {
                username: username
            }
        })

        if (userExists) {
            bcrypt.compare(password, userExists.password, (error, result) => {
                if (result) {
                    let token = jwt.sign({ id: userExists.id, email: userExists.email }, 'secretkey')
                    res.status(200).json({
                        user: {
                            id: userExists.id,
                            username: userExists.username,
                            token: token
                        }
                    })
                } else {
                    res.status(401).json({
                        message: 'Authentication failed'
                    })
                }
            })
        } else {
            res.status(401).json({
                message: 'Authentication failed'
            })
        }
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}
