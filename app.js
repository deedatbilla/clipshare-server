require('dotenv').config()
const express = require('express') 
require('./Database/db')
const userRouter = require('./Routes/auth')
const deviceRouter = require('./Routes/device')


const port = process.env.PORT
const app = express()
app.use(express.json()) 
app.use(userRouter)
app.use(deviceRouter)
app.use('/public', express.static('public'));
app.use((req, res, next) => { 
    // Error goes via `next()` method
    setImmediate(() => {
        next(new Error('Something went wrong'));
    });
});
console.log(process.env.NODE_ENV)
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
   
}) 