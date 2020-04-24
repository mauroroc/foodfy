const express = require('express');
const routes = express.Router();
const multer = require('../middlewares/multer');

const AdminRecipesController = require("../controllers/admin-recipes");

routes.get("/admin/recipes", AdminRecipesController.index);
routes.get("/admin/recipes/create", AdminRecipesController.create);
routes.get("/admin/recipes/:id", AdminRecipesController.show);
routes.get("/admin/recipes/:id/edit", AdminRecipesController.edit);
routes.post("/admin/recipes", multer.array("files", 5), AdminRecipesController.post);
routes.put("/admin/recipes", multer.array("files", 5), AdminRecipesController.put);
routes.delete("/admin/recipes", AdminRecipesController.delete);

module.exports = routes;