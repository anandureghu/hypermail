const mailRouter = require("express").Router();
const mailController = require("./mail.controller");

mailRouter.post("/", mailController.SendMailBasic);

module.exports = mailRouter;
