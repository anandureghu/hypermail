const { createTransport } = require("nodemailer");
const { getCsvData } = require("../../utils/readCsvData");
const { oAuth2Client } = require("../../utils/oAuth");
const {
  senderEmail,
  clientId,
  clientSecret,
  refreshToken,
  senderName,
} = require("../../config/app.config");
const config = require("../../config/config");
const logger = require("../../utils/logger");
const { newLinks } = require("../image/image.service");

exports.sendEmailOAuth = async () => {
  const resArr = [];
  const data = await getCsvData();
  await data.forEach(async (row) => {
    const file = row.EMAIL + ".jpg";
    const email = row.EMAIL.toString();
    const mailOptions = {
      from: `${senderName} <${senderEmail}>`,
      to: email,
      subject: "Image Embed Test",
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
          path: "uploads/generated/" + file,
          cid: "test",
        },
      ],
    };
    try {
      const accessToken = oAuth2Client.setCredentials({
        refreshToken: refreshToken,
      });
      const transport = createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: email,
          clientId: clientId,
          clientSecret: clientSecret,
          refreshToken: refreshToken,
          accessToken: accessToken,
        },
      });

      await transport.sendMail(mailOptions);
      resArr.push({ msg: "success", user: email });
    } catch (err) {
      resArr.push({ msg: "Failed", user: email });
      logger.error(err);
      console.error(err);
    }
  });

  return resArr;
};

async function sendMailBasic(data, params) {
  const mailOptions = {
    from: `${params.name} <${config.mail.from}>`,
    to: data.id,
    subject: params.subject,
    html: `
    <div>${params.descriptionBefore}</div>
    <img
        alt=""
        src="cid:imageAttachment"
        style="
            display: block;
            padding: 0px;
            max-width: 600px;
            max-height: 600px;
            object-fit: contain;
            text-align: center;
            border-radius: 32px;
        "
        data-bit="iit"
    />
    <div>${params.descriptionAfter}</div>
          `,
    attachments: [
      {
        filename: data.file,
        path: "uploads/generated/" + data.file,
        cid: `imageAttachment`,
      },
    ],
  };
  const transport = createTransport({
    service: "gmail",
    auth: {
      user: config.mail.from,
      pass: config.mail.password,
    },
  });

  await transport.sendMail(mailOptions);
}

module.exports = { sendMailBasic };
