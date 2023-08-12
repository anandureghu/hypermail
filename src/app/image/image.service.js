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
          registerFont(getFontPath(fontData.fileName.toLowerCase()), {
            family: fontData.family,
          });
        });
      }

      const font = `${
        t.font.size.includes("px") ? t.font.size : t.font.size + "px"
      } ${t.font.family || "sans-serif"}`;
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
  fileName = `${data[options.file.nameKey]}${
    options.file.index ? i++ : ""
  }.${fileExtension}`;
  let fileDir = `${dir}/${fileName}`;
  try {
    fs.writeFileSync(fileDir, canvas.toBuffer(), { flag: "wx" });
  } catch (error) {
    fileName = `${data[options.file.nameKey]}${
      options.file.index ? i++ : ""
    }${Date.now()}.${fileExtension}`;
    fileDir = `${dir}/${fileName}`;
    fs.writeFileSync(fileDir, canvas.toBuffer(), { flag: "wx" });
  }
  return fileName;
}

const generateImage = async (options, req, demo) => {
  const baseImage = getBaseImage();
  let csvData = await getCsvData();
  if (demo) {
    var data = csvData[Math.floor(Math.random() * csvData.length)];
    csvData = [data];
  }
  const generatedImages = csvData.map(async (data) => {
    const file = await addTextsOnImage(data, baseImage, options);
    const fileLink = `${req.protocol}://${req.get("host")}/generated/${file}`;
    return {
      file,
      fileLink,
      sending: true,
      send: false,
      id: data[options.file.nameKey],
    };
  });
  const links = await Promise.all(generatedImages);
  const newLinks = links.reduce((link, currentLink) => {
    link[currentLink.id] = currentLink;
    return link;
  }, {});
  i = 0;
  storeGeneratedFilesMetadata(newLinks);
  return true;
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

function storeGeneratedFilesMetadata(metadata) {
  const dirPath = "db/metadata";
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  let jsonData = JSON.stringify(metadata, null, 2);
  fs.writeFileSync(dirPath + "metadata.json", jsonData);
}

module.exports = { generateImage };
