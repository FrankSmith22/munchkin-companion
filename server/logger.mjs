import { createLogger, format, transports } from "winston";

const LOG_LEVEL = "info"

export const logger = createLogger({
  level: LOG_LEVEL,
  format: format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or higher to `error.log`
    //   (i.e., error, fatal, but not other levels)
    //
    new transports.File({ filename: 'error.log', level: 'error' }),
    //
    // - Write all logs with importance level of `info` or higher to `combined.log`
    //   (i.e., fatal, error, warn, and info, but not trace)
    //
    new transports.File({ filename: 'combined.log' }),
  ],
});