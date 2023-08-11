const csv = require('csvtojson/v2');
const { readdirSync } = require('fs');
const logger = require('./logger');
const { join } = require('path');

module.exports.getCsvData = async () => {
  const dir = "uploads/data";
  const file = readdirSync(dir)[0];
  const filePath = join(dir, file);
  try {
    const jsonArr = await csv().fromFile(filePath);
    return jsonArr;
  } catch (err) {
    logger.error(err);
  }
}