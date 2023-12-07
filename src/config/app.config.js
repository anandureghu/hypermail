const { PORT, NODE_ENV } = process.env;

module.exports = {
  port: PORT || 3000,
  env: NODE_ENV,
};
