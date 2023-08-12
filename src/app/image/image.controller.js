const httpStatus = require("http-status");
const logger = require("../../utils/logger");
const imageService = require("./image.service");
const Response = require("../../common/dto/response.dto");
const { getCsvFields } = require("../../utils/readCsvData");

const UploadFiles = async (req, res) => {
  const csvFields = await getCsvFields();
  const response = new Response(httpStatus.OK, "Successfully uploaded files", {
    fields: csvFields,
  });
  res.status(response.code).send(response);
};

const GenerateImage = async (req, res) => {
  const options = req.body;
  const demo = req.query.demo === "true";

  try {
    const generatedImages = await imageService.generateImage(options, req, demo);
    if(generatedImages){
      const response = new Response(
        httpStatus.CREATED,
        "images generated successfully",
        { generated: generatedImages }
      );
      res.status(response.code).send(response);
    }
    else{
     throw new Error("something happened please try again later") 
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send({});
  }
};

module.exports = {
  GenerateImage,
  UploadFiles,
};
