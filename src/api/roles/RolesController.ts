import { Request, Response } from "express";
import RolesService from "./RolesService";
import { CreateRoleDto } from "./RolesDto";

export default class RolesController {
    static async createRole(req: Request, res: Response) {
        try {
            const { name, description } = req.body;
            const data: CreateRoleDto = { name, description };

            if(!name) {
                res.status(400).json({ error: "Role name is required." });
            }
            
            const role = await RolesService.createRole(data);
            
            res.status(201).json(role);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getRoleById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if(!id) {
                res.status(400).json({ error: "No ID provided." });
            }

            const role = await RolesService.getRoleById(id);
            res.status(200).json(role);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    static async getAllRoles(req: Request, res: Response) {
        try {
            const roles = await RolesService.getAllRoles();
            res.status(200).json(roles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateRole(req: Request, res: Response) {
        try {
            const role = await RolesService.updateRole(req.params.id, req.body);
            res.status(200).json(role);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    static async deleteRole(req: Request, res: Response) {
        try {
            await RolesService.deleteRole(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}