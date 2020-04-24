const express = require('express');
const routes = express.Router();
const multer = require('../middlewares/multer');

const AdminChefsController = require("../controllers/admin-chefs");

routes.get("/admin/chefs", AdminChefsController.index);
routes.get("/admin/chefs/create", AdminChefsController.create);
routes.get("/admin/chefs/:id", AdminChefsController.show);
routes.get("/admin/chefs/:id/edit", AdminChefsController.edit);
routes.post("/admin/chefs", multer.array("files", 1), AdminChefsController.post);
routes.put("/admin/chefs", multer.array("files", 1), AdminChefsController.put);
routes.delete("/admin/chefs", AdminChefsController.delete);

module.exports = routes;