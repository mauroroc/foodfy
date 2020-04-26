const express = require('express');
const nunjucks = require('nunjucks');

const recipes = require("./app/routes/recipes");
const adminRecipes = require("./app/routes/admin-recipes");
const adminChefs = require("./app/routes/admin-chefs");
const adminUsers = require("./app/routes/admin-users");

const methodOverride = require('method-override');
const session = require('./config/session');

const server = express();

server.use(session);
server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'));
server.use(methodOverride('_method'));

//Carregando as rotas
server.use(recipes);
server.use(adminRecipes);
server.use(adminChefs);
server.use(adminUsers);

server.set("view engine", "njk");

nunjucks.configure("src/app/views", {
    express: server,
    autoescape: false,
    noCache: true
});

server.listen(5000, function() {
    console.log("Server is running");
});
