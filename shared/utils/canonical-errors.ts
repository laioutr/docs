export interface CanonicalError {
  className: string;
  code: string;
  httpStatus?: number;
  description: string;
  data?: { name: string; type: string; description?: string }[];
  reasonValues?: string[];
  domain: string;
  group: string;
  thrownBy: string[];
}

export const canonicalErrors: CanonicalError[] = [
  // ── Auth ──────────────────────────────────────────────────
  {
    className: 'InvalidCredentialsError',
    code: 'AUTH_INVALID_CREDENTIALS',
    httpStatus: 401,
    description: 'Thrown when authentication with the provided credentials fails.',
    domain: 'ecommerce',
    group: 'Auth',
    thrownBy: ['ecommerce/auth/login', 'ecommerce/product/reviews/create'],
  },
  {
    className: 'UnauthenticatedError',
    code: 'AUTH_UNAUTHENTICATED',
    httpStatus: 401,
    description: 'Thrown when the user tries to access a resource that requires authentication.',
    domain: 'ecommerce',
    group: 'Auth',
    thrownBy: [
      'ecommerce/customer/get-current',
      'ecommerce/customer/address-get-all',
      'ecommerce/customer/address-create',
      'ecommerce/customer/address-update',
      'ecommerce/customer/address-delete',
      'ecommerce/customer/address-set-default',
      'ecommerce/wishlist/add-items',
    ],
  },
  {
    className: 'CustomerDisabledError',
    code: 'AUTH_CUSTOMER_DISABLED',
    httpStatus: 403,
    description: 'Thrown when a customer that is trying to login is disabled.',
    domain: 'ecommerce',
    group: 'Auth',
    thrownBy: [],
  },

  // ── Cart ──────────────────────────────────────────────────
  {
    className: 'ProductNotFoundError',
    code: 'CART_PRODUCT_NOT_FOUND',
    httpStatus: 404,
    description: 'Thrown when a product that should be added to the cart is not found.',
    data: [{ name: 'variantId', type: 'string' }],
    domain: 'ecommerce',
    group: 'Cart',
    thrownBy: ['ecommerce/cart/add-items', 'ecommerce/wishlist/add-items'],
  },
  {
    className: 'ProductStockError',
    code: 'CART_PRODUCT_STOCK_ERROR',
    description: 'Thrown when a product cannot be added to the cart due to stock issues.',
    data: [
      { name: 'variantId', type: 'string' },
      { name: 'reason', type: 'ProductStockErrorReason' },
    ],
    reasonValues: ['OUT_OF_STOCK', 'NOT_ENOUGH_STOCK'],
    domain: 'ecommerce',
    group: 'Cart',
    thrownBy: ['ecommerce/cart/add-items'],
  },
  {
    className: 'ProductQuantityError',
    code: 'CART_PRODUCT_QUANTITY_ERROR',
    description:
      'Thrown when an item cannot be added to the cart due to quantity constraints.',
    data: [
      { name: 'variantId', type: 'string' },
      { name: 'reason', type: 'ProductQuantityErrorReason' },
    ],
    reasonValues: ['MINIMUM_NOT_MET', 'MAXIMUM_EXCEEDED', 'INVALID_INCREMENT'],
    domain: 'ecommerce',
    group: 'Cart',
    thrownBy: ['ecommerce/cart/add-items'],
  },
  {
    className: 'DiscountCodeNotFoundError',
    code: 'CART_DISCOUNT_CODE_NOT_FOUND',
    httpStatus: 404,
    description: 'Thrown when a discount code that should be added to the cart is not found.',
    data: [{ name: 'code', type: 'string' }],
    domain: 'ecommerce',
    group: 'Cart',
    thrownBy: ['ecommerce/cart/add-items'],
  },
  {
    className: 'DiscountCodeNotRedeemableError',
    code: 'CART_DISCOUNT_CODE_NOT_REDEEMABLE',
    description:
      'Thrown when a discount code cannot be applied to the cart.',
    data: [
      { name: 'code', type: 'string' },
      { name: 'reason', type: 'DiscountCodeNotRedeemableErrorReason' },
    ],
    reasonValues: [
      'CODE_NOT_HONOURED',
      'CURRENTLY_INACTIVE',
      'CUSTOMER_NOT_ELIGIBLE',
      'CUSTOMER_USAGE_LIMIT_REACHED',
      'ELIGIBLE_CUSTOMER_MISSING',
      'INCOMPATIBLE_PURCHASE_TYPE',
      'NO_ENTITLED_LINE_ITEMS',
      'NO_ENTITLED_SHIPPING_LINES',
      'PURCHASE_NOT_IN_RANGE',
      'QUANTITY_NOT_IN_RANGE',
      'USAGE_LIMIT_REACHED',
      'OTHER',
    ],
    domain: 'ecommerce',
    group: 'Cart',
    thrownBy: ['ecommerce/cart/add-items'],
  },

  // ── Customer ──────────────────────────────────────────────
  {
    className: 'AddressNotFoundError',
    code: 'CUSTOMER_ADDRESS_NOT_FOUND',
    httpStatus: 404,
    description: 'Thrown when an address with the given ID is not found.',
    data: [{ name: 'id', type: 'string' }],
    domain: 'ecommerce',
    group: 'Customer',
    thrownBy: [
      'ecommerce/customer/address-update',
      'ecommerce/customer/address-delete',
      'ecommerce/customer/address-set-default',
    ],
  },
  {
    className: 'InvalidFieldError',
    code: 'INVALID_FIELD',
    description:
      'Thrown when a field in the input is invalid. Use for backend-system validation errors when no more specific error applies.',
    data: [
      { name: 'reason', type: 'InvalidFieldErrorReason' },
      { name: 'field', type: 'string[]', description: 'Path to the invalid field' },
    ],
    reasonValues: ['MISSING', 'TOO_LONG', 'TOO_SHORT', 'INVALID_FORMAT', 'INVALID_VALUE'],
    domain: 'ecommerce',
    group: 'Customer',
    thrownBy: [
      'ecommerce/auth/register',
      'ecommerce/customer/address-create',
      'ecommerce/customer/address-update',
    ],
  },

  // ── Product ───────────────────────────────────────────────
  {
    className: 'CategoryNotFoundError',
    code: 'CATEGORY_NOT_FOUND',
    httpStatus: 404,
    description: 'Thrown when a category with the given ID is not found.',
    data: [{ name: 'id', type: 'string' }],
    domain: 'ecommerce',
    group: 'Product',
    thrownBy: [],
  },

  // ── Blog ──────────────────────────────────────────────────
  {
    className: 'BlogCollectionBySlugNotFoundError',
    code: 'BLOG_COLLECTION_NOT_FOUND',
    httpStatus: 404,
    description: 'Thrown when a blog collection with the given slug is not found.',
    data: [{ name: 'slug', type: 'string' }],
    domain: 'blog',
    group: 'Collection',
    thrownBy: [],
  },
  {
    className: 'BlogPostBySlugNotFoundError',
    code: 'BLOG_POST_NOT_FOUND',
    httpStatus: 404,
    description: 'Thrown when a blog post with the given slug is not found.',
    data: [{ name: 'slug', type: 'string' }],
    domain: 'blog',
    group: 'Post',
    thrownBy: [],
  },
];
