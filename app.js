var express=require('express');
var app=express();

var ejslayout=require('express-ejs-layouts');

const expressSession = require('express-session')
const flash=require('connect-flash');
const passport=require('passport');

require('./config/passport')(passport);

app.use(ejslayout);
app.set('view engine','ejs');

app.use(express.urlencoded({extended:false}));

app.use(expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req,res,next) => {
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
})


var mongoose=require('mongoose');

const db=require('./config/keys').MongoURI;

console.log(db)

mongoose.connect(db,{useUnifiedTopology:true,useNewUrlParser:true})
    .then(() => console.log("MongoDB Connection Established"))
    .catch(err => console.log(err));

var bodyparser=require('body-parser');
urlencoder=bodyparser.urlencoded({extended:false});

app.use('/',require('./Router/index'));
app.use('/user',require('./Router/users'));




app.listen(8080);