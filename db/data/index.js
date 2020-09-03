const testData = require("./test-data");
const developmentdata = require("./dev-data");

const ENV = process.env.NODE_ENV || "development";

if (ENV === "development" || ENV === "production") exportData = developmentdata;
else exportData = testData;

module.exports = exportData;
