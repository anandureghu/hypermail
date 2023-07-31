const imageRouter = require("express").Router();
const imageController = require("./image.controller");
const { clearUploads } = require("../../utils/utils");
const uploadHandler = require("../../handler/upload.handler");

imageRouter.post(
  "/upload",
  (req, res, next) => {
    clearUploads("uploads/base");
    clearUploads("uploads/fonts");
    clearUploads("uploads/data");
    clearUploads("uploads/generated");
    clearUploads('uploads/csv-data');
    next();
  },
  uploadHandler,
  imageController.UploadFiles
);

imageRouter.post("/generate", imageController.GenerateImage);

module.exports = imageRouter;
