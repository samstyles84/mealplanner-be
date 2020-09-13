const express = require("express");
const apiRouter = require("./routes/api.router");
const cors = require("cors");
const ENV = process.env.NODE_ENV || "development";
const cloudinary = require("cloudinary").v2;
const formData = require("express-form-data");

const {
  handlePSQLErrors,
  handleCustomErrors,
  handle404s,
  handle500s,
} = require("./errors");

require("dotenv").config();

console.log("in the app");

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(formData.parse());

app.use("/api", apiRouter);
app.all("*", handle404s);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "test-folder",
//     format: async (req, file) => "png", // supports promises as well
//     public_id: (req, file) => "computed-filename-using-request",
//   },
// });

// const parser = multer({ storage: storage });

// app.post("/api/meals/1", parser.single("image"), function (req, res) {
//   console.log("posting with multer?", req);
//   res.json(req.file);
// });

// app.all("/", function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, authorization"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   next();
// });

// if (ENV !== "test") {
//   // Set up a whitelist and check against it:
//   var whitelist = [
//     "https://react-image-upload.surge.sh",
//     "http://localhost:3000",
//     "http://localhost:9090",
//   ];
//   var corsOptions = {
//     origin: function (origin, callback) {
//       console.log(origin, "origin");
//       if (whitelist.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS", origin));
//       }
//     },
//   };
//   // Then pass them to cors:
//   app.use(cors(corsOptions));
// }
