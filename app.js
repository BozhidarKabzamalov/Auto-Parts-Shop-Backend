var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var routes = require('./routes/routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var cors = require('cors');
app.use(cors());

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let User = require('./models/User');
let Product = require('./models/Product');
let Category = require('./models/Category');
let Model = require('./models/Model');
let Brand = require('./models/Brand');
let Order = require('./models/Order');
let Order_Product = require('./models/Order_Product')

Category.hasMany(Product)
Product.belongsTo(Category)

Brand.hasMany(Model)
Model.belongsTo(Brand)

Brand.belongsToMany(Product, { through: 'Brand_Product' })
Product.belongsToMany(Brand, { through: 'Brand_Product' })

Model.belongsToMany(Product, { through: 'Model_Product' })
Product.belongsToMany(Model, { through: 'Model_Product' })

Order.belongsToMany(Product, { through: Order_Product })
Product.belongsToMany(Order, { through: Order_Product })

/*let sequelize = require('./controllers/DatabaseController');
sequelize.sync().then(result => {
    console.log('Synced')
}).catch(error => {
    console.log(error);
})*/

module.exports = app;
