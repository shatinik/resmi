const app = require('express')();
const router = require('./router')(app);

const serverStartType = process.env.NODE_ENV || 'development';
const port = 1337;


app.listen(port, function () {
    console.log(`Server is running on port ${port} in ${serverStartType} mode.`);
});