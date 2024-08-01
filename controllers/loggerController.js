const {createLogger, format, transports} = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({format: "YYYY-MM-DD HH:MM:SS"}),
    format.json(), 
    format.simple(),
    ),
  transports: [
    new transports.File({
        filename: "logs/info.log",
        level: "info",
        // maxsize: 5242880,  // 5MB
        // maxFiles: 5,
    }),
    new transports.File({
        filename: "logs/error.log",
        level: "error",
    }),
    // new transports.Console({
    // format: format.combine(format.colorize(), format.simple()),
    // })
],
});

module.exports = {logger};