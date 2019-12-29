const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRouter = require('./routers/api');

const app = express();

app.use(cors({
    origin: function(origin, callback){
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true
  }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect('mongodb://admin:admin1@ds241258.mlab.com:41258/checkimage', (err) => {
    if(err) console.log(err)
    else console.log("DB connect success!")
});
mongoose.set('useFindAndModify', false);
app.use('/api', apiRouter);


app.listen(process.env.PORT || 8000, (err) =>{
    if(err) console.log(err)
    else console.log("Server start success!")
})