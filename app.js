const express = require("express");
const connectToDB = require("./config/db");
const { logger } = require("./middlewares/logger");
const { notFound, errorHandler } = require("./middlewares/errors");
require("dotenv").config();

// dotenv.config();

connectToDB();

// init app
const app = express();

// Custom Middleware
// app.use((req, res, next) => {
//   console.log(
//     `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
//   );

//   // setTimeout(() => {
//   //   next();
//   // }, 4000);
//   next();
// });

app.use(logger);

// apply middlewares
app.use(express.json());

app.use("/api/books", require("./routes/book"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/cart", require("./routes/Cart"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));

// Error Handler Middleware

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>
  console.log(
    `Server Running in ${process.env.NODE_ENV} on port ${process.env.PORT} ...`
  )
);
