const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// /dishes routes
router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

// /dishes/:dishId routes
router
  .route("/:dishId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete) // this returns 405 by controller
  .all(methodNotAllowed);

module.exports = router;
