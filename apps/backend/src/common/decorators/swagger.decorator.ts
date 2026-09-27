import { applyDecorators } from "@nestjs/common";

import {
  refreshSwagger,
  LogoutSwagger,
  registerSwagger,
  registerAdminSwagger,
  loginSwagger,
  meSwagger,
  SessionSwagger,
  revokeSessionSwagger,
  revokeAllSessionsSwagger,
  resetPasswordSwagger,
  forgotPasswordSwagger,
  LoginAdminSwagger,
} from "../../modules/auth/swagger";
import {
  changePasswordSwagger,
  myProfileSwagger,
  updateEmailSwagger,
  updateMyProfileSwagger,
  updateMyProfileUsernameSwagger,
  verifyEmailSwagger,
} from "../../modules/users/swagger";

import {
  listCategoriesSwagger,
  categoryTreeSwagger,
  getCategorySwagger,
  getCategoryBySlugSwagger,
  getCategoryProductsSwagger,
  createCategorySwagger,
  updateCategorySwagger,
  deleteCategorySwagger,
  getCategoryChildrenSwagger,
  getCategoryChildrenBySlugSwagger,
  getCategoryProductsBySlugSwagger,
} from "../../modules/categories/swagger";
import {
  bulkCreateProductsSwagger,
  createProductSwagger,
  deleteProductSwagger,
  getProductBySlugSwagger,
  getProductCategoriesBySlugSwagger,
  getProductCategoriesSwagger,
  getProductSwagger,
  listProductsSwagger,
  updateProductSwagger,
} from "../../modules/products/swagger";

import {
  getCartSwagger,
  addToCartSwagger,
  updateCartItemSwagger,
  removeFromCartSwagger,
  clearCartSwagger,
  mergeCartSwagger,
} from "../../modules/cart/swagger";

import {
  getWishlistSwagger,
  addToWishlistSwagger,
  removeFromWishlistSwagger,
  clearWishlistSwagger,
} from "../../modules/wishlist/swagger";

// TODO: Add more swagger decorators for other endpoints as needed
type SwaggerEndpoint =
  | "me"
  | "login"
  | "login-admin"
  | "register"
  | "refresh"
  | "logout"
  | "sessions"
  | "revoke-session"
  | "revoke-all-sessions"
  | "forgot-password"
  | "register-admin"
  | "reset-password"
  | "get-my-profile"
  | "update-my-profile"
  | "update-my-username"
  | "update-my-email"
  | "verify-email"
  | "change-password"
  | "list-categories"
  | "category-tree"
  | "get-category"
  | "get-category-by-slug"
  | "get-category-products"
  | "create-category"
  | "update-category"
  | "delete-category"
  | "get-category-children"
  | "get-category-children-by-slug"
  | "get-category-products-by-slug"
  | "list-products"
  | "get-product"
  | "get-product-by-slug"
  | "get-product-categories"
  | "get-product-categories-by-slug"
  | "create-product"
  | "bulk-create-products"
  | "update-product"
  | "delete-product"
  | "get-cart"
  | "add-to-cart"
  | "update-cart-item"
  | "remove-from-cart"
  | "clear-cart"
  | "merge-cart"
  | "get-wishlist"
  | "add-to-wishlist"
  | "remove-from-wishlist"
  | "clear-wishlist";
export const Swagger = (name: SwaggerEndpoint) => {
  switch (name) {
    case "me":
      return applyDecorators(meSwagger);

    case "login":
      return applyDecorators(loginSwagger);

    case "login-admin":
      return applyDecorators(LoginAdminSwagger);

    case "register":
      return applyDecorators(registerSwagger);

    case "refresh":
      return applyDecorators(refreshSwagger);

    case "logout":
      return applyDecorators(LogoutSwagger);

    case "sessions":
      return applyDecorators(SessionSwagger);

    case "revoke-session":
      return applyDecorators(revokeSessionSwagger);

    case "revoke-all-sessions":
      return applyDecorators(revokeAllSessionsSwagger);

    case "forgot-password":
      return applyDecorators(forgotPasswordSwagger);

    case "reset-password":
      return applyDecorators(resetPasswordSwagger);

    case "get-my-profile":
      return applyDecorators(myProfileSwagger);

    case "update-my-profile":
      return applyDecorators(updateMyProfileSwagger);

    case "register-admin":
      return applyDecorators(registerAdminSwagger);

    case "update-my-username":
      return applyDecorators(updateMyProfileUsernameSwagger);

    case "update-my-email":
      return applyDecorators(updateEmailSwagger);

    case "verify-email":
      return applyDecorators(verifyEmailSwagger);

    case "change-password":
      return applyDecorators(changePasswordSwagger);

    case "list-categories":
      return applyDecorators(listCategoriesSwagger);

    case "category-tree":
      return applyDecorators(categoryTreeSwagger);

    case "get-category":
      return applyDecorators(getCategorySwagger);

    case "get-category-by-slug":
      return applyDecorators(getCategoryBySlugSwagger);

    case "get-category-products":
      return applyDecorators(getCategoryProductsSwagger);

    case "create-category":
      return applyDecorators(createCategorySwagger);

    case "update-category":
      return applyDecorators(updateCategorySwagger);

    case "delete-category":
      return applyDecorators(deleteCategorySwagger);

    case "get-category-children":
      return applyDecorators(getCategoryChildrenSwagger);

    case "get-category-children-by-slug":
      return applyDecorators(getCategoryChildrenBySlugSwagger);

    case "get-category-products-by-slug":
      return applyDecorators(getCategoryProductsBySlugSwagger);

    case "list-products":
      return applyDecorators(listProductsSwagger);
    case "get-product":
      return applyDecorators(getProductSwagger);
    case "get-product-by-slug":
      return applyDecorators(getProductBySlugSwagger);
    case "get-product-categories":
      return applyDecorators(getProductCategoriesSwagger);
    case "get-product-categories-by-slug":
      return applyDecorators(getProductCategoriesBySlugSwagger);
    case "create-product":
      return applyDecorators(createProductSwagger);
    case "bulk-create-products":
      return applyDecorators(bulkCreateProductsSwagger);
    case "update-product":
      return applyDecorators(updateProductSwagger);
    case "delete-product":
      return applyDecorators(deleteProductSwagger);

    case "get-cart":
      return applyDecorators(getCartSwagger);

    case "add-to-cart":
      return applyDecorators(addToCartSwagger);

    case "update-cart-item":
      return applyDecorators(updateCartItemSwagger);

    case "remove-from-cart":
      return applyDecorators(removeFromCartSwagger);

    case "clear-cart":
      return applyDecorators(clearCartSwagger);

    case "merge-cart":
      return applyDecorators(mergeCartSwagger);

    case "get-wishlist":
      return applyDecorators(getWishlistSwagger);

    case "add-to-wishlist":
      return applyDecorators(addToWishlistSwagger);

    case "remove-from-wishlist":
      return applyDecorators(removeFromWishlistSwagger);

    case "clear-wishlist":
      return applyDecorators(clearWishlistSwagger);

    default:
      throw new Error(`Unknown Swagger decorator: ${name}`);
  }
};
