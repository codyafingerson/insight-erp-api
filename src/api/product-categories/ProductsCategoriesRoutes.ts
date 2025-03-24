import { Router } from "express";
import ProductCategoriesController from "./ProductsCategoriesController";
import ProductCategoriesService from "./ProductsCategoriesService";

const router = Router();

const productCategoriesService = new ProductCategoriesService();
const productCategoriesController = new ProductCategoriesController(productCategoriesService);

// Middleware
import { authorize } from "../../middlewares/authorize";

/**
 * @route POST /api/employees
 * @description Creates a new employee.
 * @access Private
 */
router.post("/", authorize("create_product_category"), productCategoriesController.create);

/**
 * @route GET /api/employees
 * @description Retrieves all employees.
 * @access Private
 */
router.get("/", authorize("read_all_product_categories"), productCategoriesController.getAll);

/**
 * @route GET /api/employees/:id
 * @description Retrieves a employee by ID.
 * @access Private
 */
router.get("/:id", authorize("read_all_product_categories"), productCategoriesController.getById);

/**
 * @route PUT /api/employees/:id
 * @description Updates a employee by ID.
 * @access Private
 */
router.put("/:id", authorize("update_product_category"), productCategoriesController.update);

/**
 * @route DELETE /api/employees/:id
 * @description Deletes a employee by ID.
 * @access Private
 */
router.delete("/:id", authorize("delete_product_category"), productCategoriesController.delete)

export default router;