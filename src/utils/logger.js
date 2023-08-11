const { format, transports, createLogger } = require("winston");

const customFormat = format.combine(
  format.colorize({ all: true }),
  format.timestamp({
    format: "YY-MM-DD HH:mm:ss",
  }),
  format.printf((info) => {
    const level = info.level;
    return `[${level}] [${info.timestamp}]: ${info.message}`;
  })
);

function extractFileInfo(stack) {
  const stackInfo = stack.split("\n")[1];
  if (stackInfo) {
    const fileInfoMatch = /\s+at\s+(.+:\d+:\d+)$/i.exec(stackInfo);
    if (fileInfoMatch && fileInfoMatch.length > 1) {
      return fileInfoMatch[1];
    }
  }
  return "Unknown File";
}

const errorFormat = format.combine(
  format.colorize(),
  format.timestamp({
    format: "YY-MM-DD HH:mm:ss",
  }),
  format.printf((info) => {
    const level = info.level;
    const fileInfo = info.stack ? extractFileInfo(info.stack) : "N/A";
    return `[${level}] [${info.timestamp}] [${fileInfo}]: ${info.message}`;
  })
);

const logConfiguration = {
  transports: [new transports.Console()],
  format: format.combine(format.colorize(), customFormat),
  exceptionHandlers: [new transports.Console({ format: errorFormat })], // Handle uncaught exceptions
};

const logger = createLogger(logConfiguration);
module.exports = logger;