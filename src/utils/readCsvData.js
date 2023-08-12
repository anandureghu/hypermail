const csv = require("csvtojson/v2");
const { readdirSync } = require("fs");
const logger = require("./logger");
const { join } = require("path");

module.exports.getCsvData = async () => {
  try {
    const dir = "uploads/data";
    const file = readdirSync(dir)[0];
    const filePath = join(dir, file);
    const jsonArr = await csv().fromFile(filePath);
    return jsonArr;
  } catch (err) {
    logger.error(err);
  }
};

module.exports.getCsvFields = async () => {
  const csvData = await this.getCsvData();
  if (csvData && csvData.length) return Object.keys(csvData[0]);
  else return [];
};
