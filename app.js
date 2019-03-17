const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const flash=require("connect-flash");
const session=require('express-session');
const passport=require('passport');


const app=express();

//passport configuration
require('./config/passport')(passport);

//DataBase Configuration
const db=require('./config/keys').MongoURI;

//connect To MongoDb
mongoose.connect(db,{useNewUrlParser:true})
.then(()=>{
    console.log("Database Connected....");
})
.catch((err)=>{
    console.log("Failed To Connect Database");
    
});

//Setting Up Views
//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//BodyParser
app.use(express.urlencoded({extended:false}));

//Express Middleware Session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global Var


app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
});

//Routes
app.use('/',require('./routes/index')); //Setting Up AccessPoint For Routes
app.use('/users',require('./routes/user'));

const port=process.env.PORT ||5000;
app.listen(port,(port)=>{
    console.log(`Server Started at Port ${port}`);
    
});