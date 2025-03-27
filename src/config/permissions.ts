/**
 * Define the names and descriptions of each permission.
 * These will be used to seed the database with initial permissions.
 */
enum PermissionName {
    // User-related permissions
    CreateUser = "create_user",
    UpdateUser = "update_user",
    DeleteUser = "delete_user",
    ReadAllUsers = "read_all_users",

    // Employee-related permissions
    CreateEmployee = "create_employee",
    UpdateEmployee = "update_employee",
    DeleteEmployee = "delete_employee",
    ReadAllEmployees = "read_all_employees",

    // Role-related permissions
    CreateRole = "create_role",
    UpdateRole = "update_role",
    DeleteRole = "delete_role",
    ReadAllRoles = "read_all_roles",

    // Department-related permissions
    CreateDepartment = "create_department",
    UpdateDepartment = "update_department",
    DeleteDepartment = "delete_department",
    ReadAllDepartments = "read_all_departments",

    // Product-related permissions
    CreateProduct = "create_product",
    UpdateProduct = "update_product",
    DeleteProduct = "delete_product",
    ReadAllProducts = "read_all_products",

    // Product Category-related permissions
    CreateProductCategory = "create_product_category",
    UpdateProductCategory = "update_product_category",
    DeleteProductCategory = "delete_product_category",
    ReadAllProductCategories = "read_all_product_categories",

    // Order related permissions
    CreateOrder = "create_order",
    UpdateOrder = "update_order",
    DeleteOrder = "delete_order",
    ReadAllOrders = "read_all_orders"
}

export { PermissionName };
