const fs = require("fs");
const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");
const { getCsvData } = require("../../utils/readCsvData");

let i = 1;
async function addTextsOnImage(data, baseImage, options) {
  const fileExtension = baseImage.split(".").pop().toLowerCase();
  let fileName;
  const image = await loadImage(baseImage);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0);

  options.texts.forEach((t) => {
    const text = data[t.key];
    if (text) {
      if (options.font.external) {
        options.font.fonts.forEach((fontData) => {
          registerFont(getFontPath(fontData.fileName), {
            family: fontData.family,
          });
        });
      }

      const font = `${t.font.size} ${t.font.family || "sans-serif"}`;
      ctx.font = font;
      ctx.fillStyle = t.font.color;

      const textDimen = ctx.measureText(text);
      let xPos = t.position.x;
      let max = t.position.max < 0 ? image.width : t.position.max;
      switch (t.font.align) {
        case "center":
          xPos = t.position.x + (max - textDimen.width) / 2;
          break;
        case "left":
          xPos = t.position.x;
          break;
        case "right":
          xPos = t.position.x + (max - textDimen.width);
          break;
        default:
          xPos = t.position.x;
          break;
      }

      ctx.fillText(text, xPos, t.position.y, max);
    }
  });
  const dir = "uploads/generated";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fileName = `${data.EMAIL}${options.file.index ? i++ : ""
    }.${fileExtension}`;
  const fileDir = `${dir}/${fileName}`;
  fs.writeFileSync(fileDir, canvas.toBuffer());
  return fileName;
}

const generateImage = async (options, req) => {
  const baseImage = getBaseImage();
  const csvData = await getCsvData();
  const generatedImages = csvData.map(async (data) => {
    const file = await addTextsOnImage(data, baseImage, options);
    const fileLink = `${req.protocol}://${req.get("host")}/generated/${file}`;
    return fileLink;
  });
  const links = await Promise.all(generatedImages);
  i = 0;
  return links;
};

const getBaseImage = () => {
  const dir = "uploads/base";
  const file = fs.readdirSync(dir)[0];
  return path.join(dir, file);
};

const getFontPath = (fileName) => {
  const dir = "uploads/fonts";
  const font = fs
    .readdirSync(dir)
    .find((font) => font.includes(fileName.toLowerCase()));
  return path.join(dir, font);
};

module.exports = { generateImage };