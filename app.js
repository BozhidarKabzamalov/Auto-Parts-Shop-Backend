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
let Part = require('./models/Part');
let Category = require('./models/Category');
let Model = require('./models/Model');
let Brand = require('./models/Brand');
let Order = require('./models/Order');
let Order_Part = require('./models/Order_Part')

Category.hasMany(Part)
Part.belongsTo(Category)

Brand.hasMany(Model)
Model.belongsTo(Brand)

Brand.belongsToMany(Part, { through: 'Brand_Part' })
Part.belongsToMany(Brand, { through: 'Brand_Part' })

Model.belongsToMany(Part, { through: 'Model_Part' })
Part.belongsToMany(Model, { through: 'Model_Part' })

Order.belongsToMany(Part, { through: Order_Part })
Part.belongsToMany(Order, { through: Order_Part })

/*let sequelize = require('./controllers/DatabaseController');
sequelize.sync().then(result => {
    console.log('Synced')
}).catch(error => {
    console.log(error);
})*/

module.exports = app;
