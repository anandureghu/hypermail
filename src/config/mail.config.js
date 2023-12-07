const { FROM, TO, NAME, SUBJECT, PASS } = process.env;

module.exports = {
  from: FROM,
  to: TO,
  name: NAME,
  subject: SUBJECT,
  password: PASS,
};
