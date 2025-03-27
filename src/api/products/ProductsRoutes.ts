import { Router } from "express";
import ProductsController from "./ProductsController";
import ProductsService from "./ProductsService";

const router = Router();

const productsService = new ProductsService();
const productsController = new ProductsController(productsService);

// Middleware
import { authorize } from "../../middlewares/authorize";
import { PermissionName } from "../../config/auth/permissions";

/**
 * @route POST /api/products
 * @description Creates a new product.
 * @access Private
 */
router.post("/", authorize(PermissionName.CreateProduct), productsController.create);

/**
 * @route GET /api/products
 * @description Retrieves all products.
 * @access Private
 */
router.get("/", authorize(PermissionName.ReadAllProducts), productsController.getAll);

/**
 * @route GET /api/products/:id
 * @description Retrieves a product by ID.
 * @access Private
 */
router.get("/:id", authorize(PermissionName.ReadAllProducts), productsController.getById);

/**
 * @route PUT /api/products/:id
 * @description Updates a product by ID.
 * @access Private
 */
router.put("/:id", authorize(PermissionName.UpdateProduct), productsController.update);

/**
 * @route DELETE /api/products/:id
 * @description Deletes a product by ID.
 * @access Private
 */
router.delete("/:id", authorize(PermissionName.DeleteProduct), productsController.delete);

export default router;
