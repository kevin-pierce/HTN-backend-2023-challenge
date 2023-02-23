import express from "express";
import { getAllRoutes } from "./src/routes/index.js";

const port = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(express.json())

// Get all routes
app.use('/', getAllRoutes())

app.listen(port, () => {
  console.log(`Example REST Express app listening at http://localhost:${port}`);
});
