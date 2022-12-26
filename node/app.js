import express from "express";

const app = express();

let number = [324, 45, 786, 8976, 467];

app.get("/order", (req, res, next) => {
  let sortList = number.sort((a, b) => {
    return req.query.order === "asc" ? a - b : b - a;
  });
  res.json(sortList);
  next();
});

let user = ["ram", "hari", "shyam"];

app.get("/user", (req, res, next) => {
  let shortName = user.filter((item) => {
    return item != req.query.name;
  });
  res.json(shortName);
  next();
});

app.listen(3000, () => {
  console.log("server startes");
});
