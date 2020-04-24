const express = require('express');
const routes = express.Router();

const RecipesController = require("../controllers/recipes");
routes.get("/", RecipesController.index);
routes.get("/sobre", (req, res) => { return res.render("sobre"); });
routes.get("/receitas", RecipesController.list);
routes.get("/receita/:id", RecipesController.show);
routes.get("/chefs", RecipesController.chefs);

module.exports = routes;