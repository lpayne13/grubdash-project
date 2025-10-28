const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");

function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((d) => d.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({ status: 404, message: `Dish does not exist: ${dishId}` });
}

function validateDish(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;

  if (!name || name === "") return next({ status: 400, message: "Dish must include a name" });
  if (!description || description === "") return next({ status: 400, message: "Dish must include a description" });
  if (price === undefined) return next({ status: 400, message: "Dish must include a price" });
  if (typeof price !== "number" || price <= 0) return next({ status: 400, message: "Dish must have a price that is an integer greater than 0" });
  if (!image_url || image_url === "") return next({ status: 400, message: "Dish must include an image_url" });

  next();
}

function list(req, res) {
  res.json({ data: dishes });
}

function read(req, res) {
  res.json({ data: res.locals.dish });
}

function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function update(req, res, next) {
  const { data: { id, name, description, price, image_url } = {} } = req.body;
  const dish = res.locals.dish;

  if (id && id !== dish.id) {
    return next({ status: 400, message: `Dish id does not match route id. Dish: ${id}, Route: ${dish.id}` });
  }

  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;

  res.json({ data: dish });
}

function destroy(req, res) {
  res.status(405).json({ error: "Method not allowed" });
}

module.exports = {
  list,
  create: [validateDish, create],
  read: [dishExists, read],
  update: [dishExists, validateDish, update],
  delete: destroy,
};

