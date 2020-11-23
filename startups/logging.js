const winston = require('winston');
require('express-async-errors');

module.exports = function () {
    
    winston.add(winston.transports.File, { filename: 'logger.log' });

    process.on('uncaughtException', (ex)=> {
        console.log('unCoughtException', ex);
        winston.error(ex.message, ex);
    });

    process.on('unhandledRejection', (ex)=> {
        console.log('unhandledRejection', ex);
        winston.error(ex.message, ex);
    });
}