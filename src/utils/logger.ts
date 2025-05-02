import { existsSync, mkdirSync } from 'fs';
import winston, { transports } from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import { LOG_DIR } from '@config';

import WinstonCloudWatch from 'winston-cloudwatch';

let logTransports: winstonDaily[] = []


// if(process.env.LOG_ENV != 'serverless'){
//   if (!existsSync(logDir)) {
//     mkdirSync(logDir);
//   }
  
//   logTransports.push(// debug log setting
//     new winstonDaily({
//       level: 'debug',
//       datePattern: 'YYYY-MM-DD',
//       dirname: logDir + '/debug', // log file /logs/debug/*.log in save
//       filename: `%DATE%.log`,
//       maxFiles: 30, // 30 Days saved
//       json: false,
//       zippedArchive: true,  
//     })
//   )
//   logTransports.push(
//   // error log setting
//       new winstonDaily({
//         level: 'error',
//         datePattern: 'YYYY-MM-DD',
//         dirname: logDir + '/error', // log file /logs/error/*.log in save
//         filename: `%DATE%.log`,
//         maxFiles: 30, // 30 Days saved
//         handleExceptions: true,
//         json: false,
//         zippedArchive: true,
//       })
//     )
// }





/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  level: 'silly',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  ],
});
export {logger}