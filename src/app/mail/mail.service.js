const { createTransport } = require('nodemailer');
const { getCsvData } = require('../../utils/readCsvData');
const { oAuth2Client } = require('../../utils/oAuth');
const {
  senderEmail,
  clientId,
  clientSecret,
  refreshToken,
  senderName
} = require('../../config/app.config');
const logger = require('../../utils/logger');

exports.sendEmail = async () => {
  const resArr = [];
  const data = await getCsvData();
  await data.forEach(async (row) => {
    const file = row.EMAIL + '.jpg';
    const email = row.EMAIL.toString();
    const mailOptions = {
      from: `${senderName} <${senderEmail}>`,
      to: email,
      subject: 'Image Embed Test',
      html: `
      <img
          alt=""
          src="cid:test"
          style="
              display: block;
              padding: 0px;
              max-width: 100%;
              text-align: center;
          "
          data-bit="iit"
      />
            `,
      attachments: [
        {
          filename: file,
          path: 'uploads/generated/' + file,
          cid: 'test',
        },
      ],
    };
    try {
      const accessToken = oAuth2Client.setCredentials({ refreshToken: refreshToken });
      const transport = createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: email,
          clientId: clientId,
          clientSecret: clientSecret,
          refreshToken: refreshToken,
          accessToken: accessToken
        },
      });

      await transport.sendMail(mailOptions);
      resArr.push({ msg: 'success', user: email });
    } catch (err) {
      resArr.push({ msg: 'Failed', user: email })
      logger.error(err);
      console.error(err);
    }

  });

  return resArr;
}