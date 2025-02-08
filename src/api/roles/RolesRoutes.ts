import { Router } from "express";
import RolesController from "./RolesController";
import RolesService from "./RolesService";

const router = Router();

const rolesService = new RolesService();
const rolesController = new RolesController(rolesService);

router.post("/", rolesController.createRole);

router.get("/", rolesController.getAllRoles);

router.get("/:id", rolesController.getRoleById);

router.put("/:id", rolesController.updateRole);

router.delete("/:id", rolesController.deleteRole);

export default router;