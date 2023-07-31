const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = "uploads";
    switch (file.fieldname) {
      case "image":
        dir += "/base";
        break;
      case "font":
        dir += "/fonts";
        break;
      case "data":
        dir += "/data";
        break;
      case "csvdata":
        dir += '/csv-data';
        break;
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.toLowerCase().replaceAll(" ", "-"));
  },
});

const upload = multer({ storage });
const uploadHandler = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "data", maxCount: 1 },
  { name: "font" },
  { name: 'csvdata', maxCount: 1 }
]);

module.exports = uploadHandler;
