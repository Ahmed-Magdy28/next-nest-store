import type {
  OrderDto,
  CreateOrderDto,
  ListOrdersQueryDto,
  PaginatedResultDto,
} from "@repo/shared/dtos/e-commerce";
import { apiClient } from "../common/client";
import { getStoredGuestToken } from "./cart";

/**
 * Create a new order from current cart
 */
export async function createOrder(body: CreateOrderDto): Promise<OrderDto> {
  const guestToken = getStoredGuestToken();
  const headers: Record<string, string> = {};
  if (guestToken) {
    headers["x-guest-cart-token"] = guestToken;
  }

  return apiClient.post<OrderDto>("/orders", body, {
    headers: Object.keys(headers).length > 0 ? headers : undefined,
  });
}

/**
 * Fetch orders for currently logged in customer
 */
export async function fetchMyOrders(
  query: Partial<ListOrdersQueryDto> = {},
): Promise<PaginatedResultDto<OrderDto>> {
  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });

  const qs = searchParams.toString();
  const path = qs ? `/orders/my?${qs}` : "/orders/my";

  return apiClient.get<PaginatedResultDto<OrderDto>>(path);
}

/**
 * Fetch a single order by ID for the currently logged in customer
 */
export async function fetchMyOrderById(id: string): Promise<OrderDto> {
  return apiClient.get<OrderDto>(`/orders/my/${id}`);
}
