const imageRouter = require("express").Router();
const imageController = require("./image.controller");
const { clearUploads } = require("../../utils/utils");
const uploadHandler = require("../../handler/upload.handler");

imageRouter.post(
  "/upload",
  (req, res, next) => {
    clearUploads("uploads/base");
    // clearUploads("uploads/fonts");
    clearUploads("uploads/data");
    clearUploads("uploads/generated");
    next();
  },
  uploadHandler,
  imageController.UploadFiles
);

imageRouter.post("/generate", imageController.GenerateImage);
imageRouter.get("/generated", imageController.GetGeneratedImages);

module.exports = imageRouter;
