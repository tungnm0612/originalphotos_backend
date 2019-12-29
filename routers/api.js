const express = require('express');
const ApiRouter = express.Router();
const userRouter = require('./user');
const authRouter = require('./auth');
const imageRouter = require('./image')

ApiRouter.get('/', (req, res) =>{
    res.send('CheckImage API!');
});

ApiRouter.use('/auth', authRouter);
ApiRouter.use('/users', userRouter);
ApiRouter.use('/images', imageRouter);


module.exports = ApiRouter;