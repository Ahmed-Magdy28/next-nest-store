// Cart-related shared constants

/** Guest cart cookie name */
export const GUEST_CART_COOKIE_NAME = "guest_cart_token";

/** Guest cart cookie TTL: 30 days in milliseconds */
export const GUEST_CART_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Max quantity per single cart item */
export const MAX_CART_ITEM_QUANTITY = 99;

/** Max distinct items allowed in a cart */
export const MAX_CART_ITEMS = 50;

/** Cookie path */
export const GUEST_CART_COOKIE_PATH = "/";
