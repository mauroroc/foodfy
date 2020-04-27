const express = require('express');
const routes = express.Router();

const ProfileController = require("../controllers/profiles");
const UserController = require("../controllers/users");
const SessionController = require("../controllers/session");

const { onlyUsers, onlyAdmin, isLoggedToProfile } = require('../middlewares/session');

routes.get('/login', isLoggedToProfile, SessionController.loginform);
routes.post('/login', SessionController.login);
routes.post('/logout', SessionController.logout);
routes.get('/forgot', SessionController.forgot);
routes.post('/forgot', SessionController.sendpasswd);
routes.get('/reset', SessionController.resetform);
routes.post('/reset', SessionController.reset);

routes.get('/admin/profile', onlyUsers, ProfileController.index) ;
routes.put('/admin/profile', ProfileController.put);

routes.get('/admin/users', onlyAdmin, UserController.list);
routes.get('/admin/users/create', onlyAdmin, UserController.create);
routes.post('/admin/users', onlyAdmin, UserController.post);
routes.get('/admin/users/:id/edit', onlyAdmin, UserController.edit);
routes.put('/admin/users', onlyAdmin, UserController.put);
routes.delete('/admin/users', onlyAdmin, UserController.delete);

module.exports = routes;