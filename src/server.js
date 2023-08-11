require("dotenv").config();
const express = require("express");

const config = require("./config/config");
const logger = require("./utils/logger");
const routers = require("./routes/routes");
const imageService = require("./app/image/image.service");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("uploads"));

app.use("/api/v1/images", routers.imageRouter);
app.use('/api/v1/email', routers.mailRouter);

const PORT = config.app.port;
app.listen(PORT, () => {
  logger.info(`server started listening on port ${PORT}`);
});
