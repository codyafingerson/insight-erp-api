import { Router } from "express";
import ProductsController from "./ProductsController";
import ProductsService from "./ProductsService";

const router = Router();

const productsService = new ProductsService();
const productsController = new ProductsController(productsService);

// Middleware
import { authorize } from "../../middlewares/authorize";

/**
 * @route POST /api/products
 * @description Creates a new product.
 * @access Private
 */
router.post("/", authorize("create_product"), productsController.create);

/**
 * @route GET /api/products
 * @description Retrieves all products.
 * @access Private
 */
router.get("/", authorize("read_all_products"), productsController.getAll);

/**
 * @route GET /api/products/:id
 * @description Retrieves a product by ID.
 * @access Private
 */
router.get("/:id", authorize("read_product"), productsController.getById);

/**
 * @route PUT /api/products/:id
 * @description Updates a product by ID.
 * @access Private
 */
router.put("/:id", authorize("update_product"), productsController.update);

/**
 * @route DELETE /api/products/:id
 * @description Deletes a product by ID.
 * @access Private
 */
router.delete("/:id", authorize("delete_product"), productsController.delete);

export default router;