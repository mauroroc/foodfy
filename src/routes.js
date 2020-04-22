const express = require('express');
const routes = express.Router();
const multer = require('./app/middlewares/multer');

const recipes = require("./app/controllers/recipes");
const admrecipes = require("./app/controllers/admin-recipes");
const admchefs = require("./app/controllers/admin-chefs");

routes.get("/", recipes.index);
routes.get("/sobre", (req, res) => { return res.render("sobre"); });
routes.get("/receitas", recipes.list);
routes.get("/receita/:id", recipes.show);
routes.get("/chefs", recipes.chefs);

routes.get("/admin/recipes", admrecipes.index);
routes.get("/admin/recipes/create", admrecipes.create);
routes.get("/admin/recipes/:id", admrecipes.show);
routes.get("/admin/recipes/:id/edit", admrecipes.edit);
routes.post("/admin/recipes", multer.array("files", 5), admrecipes.post);
routes.put("/admin/recipes", multer.array("files", 5), admrecipes.put);
routes.delete("/admin/recipes", admrecipes.delete);

routes.get("/admin/chefs", admchefs.index);
routes.get("/admin/chefs/create", admchefs.create);
routes.get("/admin/chefs/:id", admchefs.show);
routes.get("/admin/chefs/:id/edit", admchefs.edit);
routes.post("/admin/chefs", multer.array("files", 1), admchefs.post);
routes.put("/admin/chefs", multer.array("files", 1), admchefs.put);
routes.delete("/admin/chefs", admchefs.delete);

module.exports = routes;