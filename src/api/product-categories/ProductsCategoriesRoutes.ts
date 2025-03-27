import { Router } from "express";
import ProductCategoriesController from "./ProductsCategoriesController";
import ProductCategoriesService from "./ProductsCategoriesService";

const router = Router();

const productCategoriesService = new ProductCategoriesService();
const productCategoriesController = new ProductCategoriesController(productCategoriesService);

// Middleware
import { authorize } from "../../middlewares/authorize";
import { PermissionName } from "../../config/auth/permissions";

/**
 * @route POST /api/employees
 * @description Creates a new employee.
 * @access Private
 */
router.post("/", authorize(PermissionName.CreateProductCategory), productCategoriesController.create);

/**
 * @route GET /api/employees
 * @description Retrieves all employees.
 * @access Private
 */
router.get("/", authorize(PermissionName.ReadAllProductCategories), productCategoriesController.getAll);

/**
 * @route GET /api/employees/:id
 * @description Retrieves a employee by ID.
 * @access Private
 */
router.get("/:id", authorize(PermissionName.ReadAllProductCategories), productCategoriesController.getById);

/**
 * @route PUT /api/employees/:id
 * @description Updates a employee by ID.
 * @access Private
 */
router.put("/:id", authorize(PermissionName.UpdateProductCategory), productCategoriesController.update);

/**
 * @route DELETE /api/employees/:id
 * @description Deletes a employee by ID.
 * @access Private
 */
router.delete("/:id", authorize(PermissionName.DeleteProductCategory), productCategoriesController.delete);

export default router;
