const express = require('express');
const routes = express.Router();
const multer = require('../middlewares/multer');

const AdminRecipesController = require("../controllers/admin-recipes");
const { onlyUsers } = require('../middlewares/session');

routes.get("/admin/recipes", onlyUsers, AdminRecipesController.index);
routes.get("/admin/recipes/create", onlyUsers, AdminRecipesController.create);
routes.get("/admin/recipes/:id", onlyUsers, AdminRecipesController.show);
routes.get("/admin/recipes/:id/edit", onlyUsers, AdminRecipesController.edit);
routes.post("/admin/recipes", multer.array("files", 5), AdminRecipesController.post);
routes.put("/admin/recipes", multer.array("files", 5), AdminRecipesController.put);
routes.delete("/admin/recipes", AdminRecipesController.delete);

module.exports = routes;