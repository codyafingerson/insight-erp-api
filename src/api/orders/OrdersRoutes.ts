import { Router } from "express";
import { PermissionName } from "../../config/auth/permissions.ts";
import OrdersController from "./OrdersController.ts";
import OrdersService from "./OrdersService.ts";
// Middleware
import { authorize } from "../../middlewares/authorize";

const router = Router();

const ordersService = new OrdersService();
const ordersController = new OrdersController(ordersService);

/**
 * @route POST /api/orders
 * @description Creates a new order.
 * @access Private
 */
router.post("/", authorize(PermissionName.CreateOrder), ordersController.create);

/**
 * @route GET /api/orders
 * @description Retrieves all orders.
 * @access Private
 */
router.get("/", authorize(PermissionName.ReadAllOrders), ordersController.getAll);

/**
 * @route GET /api/orders/:id
 * @description Retrieves an order by ID.
 * @access Private
 */
router.get("/:id", authorize(PermissionName.ReadAllOrders), ordersController.getById);

/**
 * @route PUT /api/orders/:id
 * @description Updates an order by ID.
 * @access Private
 */
router.put("/:id", authorize(PermissionName.UpdateOrder), ordersController.update);

/**
 * @route DELETE /api/orders/:id
 * @description Deletes a order by ID.
 * @access Private
 */
router.delete("/:id", authorize(PermissionName.DeleteOrder), ordersController.delete);

export default router;
