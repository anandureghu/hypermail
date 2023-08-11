const mailRouter = require("express").Router();
const mailController = require("./mail.controller");

mailRouter.post(
  '/',
  mailController.sendMail
);

module.exports = mailRouter;