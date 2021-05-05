const express=require('express')
const path=require('path')
const dotenv=require('dotenv')
const morgan=require('morgan')
const hbs=require('express-handlebars')
const passport=require('passport')
const session=require('express-session')
const connectDB=require('./config/db')


dotenv.config({path:'./config/config.env'})

require('./config/passport').google(passport)
require('./config/passport').github(passport)

connectDB()

const app=express()

if(process.env.NODE_ENV=='development'){
    app.use(morgan('dev'))
}

app.engine('.hbs',hbs({extname:'.hbs',defaultLayout:'main'}))
app.set('view engine','.hbs')


app.use(session({
    secret: 'my name is krishna',
    resave: false,
    saveUninitialized: false,
  }))
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname,'public')))

app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))


const PORT=process.env.PORT || 5000

app.listen(PORT,console.log(`App running in ${process.env.NODE_ENV} mode on port ${PORT}`))