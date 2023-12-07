const httpStatus = require("http-status");
const logger = require("../../utils/logger");
const mailService = require("./mail.service");

exports.sendMail = async (req, res) => {
  try {
    const result = await mailService.sendEmail();
    res.status(200).json({ message: result });
  } catch (err) {
    console.error(err);
    throw new Error("Error");
  }
};

const SendMailBasic = async (req, res) => {
  try {
    const data = req.body.data;
    const config = req.body.config;
    const result = await mailService.sendMailBasic(data, config);
    res.status(201).send({ msg: "success", data });
  } catch (err) {
    logger.error(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({});
  }
};

module.exports = {
  SendMailBasic,
};
