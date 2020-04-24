const express = require('express');
const routes = express.Router();

const ProfileController = require("../controllers/profiles");
const UserController = require("../controllers/users");
const SessionController = require("../controllers/session");

routes.get('/login', SessionController.loginform);
routes.post('/login', SessionController.login);
routes.post('/logout', SessionController.logout);

routes.get('/admin/profile', ProfileController.index) ;
routes.put('/admin/profile', ProfileController.put);

routes.get('/admin/users', UserController.list);
routes.get('/admin/users/create', UserController.create);
routes.post('/admin/users', UserController.post);
routes.get('/admin/users/:id/edit', UserController.edit);
routes.put('/admin/users', UserController.put);
routes.delete('/admin/users', UserController.delete);

module.exports = routes;