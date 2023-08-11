const mailService = require('./mail.service');

exports.sendMail = async (req, res, next) => {
  try {
    const result = await mailService.sendEmail();
    res.status(200).json({ message: result });
  } catch (err) {
    console.error(err);
    throw new Error('Error');
  }

}