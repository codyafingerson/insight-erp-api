import { Router } from "express";
import RolesController from "./RolesController";

const router = Router();

router.post("/", RolesController.createRole);

router.get("/", RolesController.getAllRoles);

router.get("/:id", RolesController.getRoleById);

router.put("/:id", RolesController.updateRole);

router.delete("/:id", RolesController.deleteRole);

export default router;