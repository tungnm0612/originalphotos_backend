const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
// const session = require('express-session');
// const jwt = require('jsonwebtoken');

const apiRouter = require('./routers/api');

const app = express();

// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 1000*60*60*24*7
//     }
// }));

// app.use(cors({ origin: ['http://localhost:3000', 'http://ec2-3-86-215-108.compute-1.amazonaws.com'], credentials: true }));

app.use(cors({
    origin: function(origin, callback){
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true
  }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// mongodb://<dbuser>:<dbpassword>@ds241258.mlab.com:41258/checkimage
mongoose.connect('mongodb://admin:admin1@ds241258.mlab.com:41258/checkimage', (err) => {
    if(err) console.log(err)
    else console.log("DB connect success!")
});
mongoose.set('useFindAndModify', false);
// app.use(cors())
// app.options('*', cors())
app.use('/api', apiRouter);


app.listen(process.env.PORT || 8000, (err) =>{
    if(err) console.log(err)
    else console.log("Server start success!")
})