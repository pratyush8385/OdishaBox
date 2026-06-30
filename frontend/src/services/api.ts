const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("odishabox_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Something went wrong");
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

export const api = {
  // Authentication
  auth: {
    login: async (email: string, password: string) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await handleResponse(res);
      if (typeof window !== "undefined") {
        localStorage.setItem("odishabox_token", data.token);
        localStorage.setItem("odishabox_user", JSON.stringify(data));
      }
      return data;
    },
    register: async (email: string, password: string, name: string, phoneNumber?: string) => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, phoneNumber }),
      });
      const data = await handleResponse(res);
      if (typeof window !== "undefined") {
        localStorage.setItem("odishabox_token", data.token);
        localStorage.setItem("odishabox_user", JSON.stringify(data));
      }
      return data;
    },
    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("odishabox_token");
        localStorage.removeItem("odishabox_user");
      }
    },
    getCurrentUser: () => {
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("odishabox_user");
        return userStr ? JSON.parse(userStr) : null;
      }
      return null;
    }
  },

  // Products & Categories
  products: {
    getAll: async (search?: string, categoryId?: number) => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (categoryId) params.append("categoryId", categoryId.toString());
      
      const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getById: async (id: number) => {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getRecommendations: async (id: number) => {
      const res = await fetch(`${API_BASE_URL}/products/${id}/recommendations`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getBestSellers: async () => {
      const res = await fetch(`${API_BASE_URL}/products/bestsellers`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getNewArrivals: async () => {
      const res = await fetch(`${API_BASE_URL}/products/newarrivals`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getFestivalSpecials: async () => {
      const res = await fetch(`${API_BASE_URL}/products/festivalspecials`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getCategories: async () => {
      const res = await fetch(`${API_BASE_URL}/products/categories`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getCategoryBySlug: async (slug: string) => {
      const res = await fetch(`${API_BASE_URL}/products/categories/${slug}`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getReviews: async (id: number) => {
      const res = await fetch(`${API_BASE_URL}/products/${id}/reviews`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    addReview: async (id: number, rating: number, comment: string) => {
      const res = await fetch(`${API_BASE_URL}/products/${id}/reviews`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ rating, comment }),
      });
      return handleResponse(res);
    }
  },

  // User details & Address
  user: {
    getProfile: async () => {
      const res = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getAddresses: async () => {
      const res = await fetch(`${API_BASE_URL}/user/addresses`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    addAddress: async (address: {
      name: string;
      streetAddress: string;
      city: string;
      state: string;
      zipCode: string;
      phoneNumber: string;
      isDefault: boolean;
    }) => {
      const res = await fetch(`${API_BASE_URL}/user/addresses`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(address),
      });
      return handleResponse(res);
    },
    deleteAddress: async (id: number) => {
      const res = await fetch(`${API_BASE_URL}/user/addresses/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  },

  // Coupons
  coupons: {
    apply: async (code: string, amount: number) => {
      const res = await fetch(`${API_BASE_URL}/coupons/apply`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ code, amount }),
      });
      return handleResponse(res);
    }
  },

  // Orders
  orders: {
    create: async (orderData: {
      items: { productId: number; quantity: number }[];
      addressId: number;
      deliverySlot: string;
      paymentMethod: string;
      couponCode?: string;
    }) => {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(orderData),
      });
      return handleResponse(res);
    },
    verifyPayment: async (orderId: number, razorpayPaymentId: string, razorpaySignature: string) => {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/verify`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ razorpayPaymentId, razorpaySignature }),
      });
      return handleResponse(res);
    },
    getUserOrders: async () => {
      const res = await fetch(`${API_BASE_URL}/orders/user`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  },

  // Admin endpoints
  admin: {
    getDashboardSummary: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getAllOrders: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/orders`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    updateOrderStatus: async (orderId: number, status: string) => {
      const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      return handleResponse(res);
    },
    createProduct: async (productData: any) => {
      const res = await fetch(`${API_BASE_URL}/admin/products`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(productData),
      });
      return handleResponse(res);
    },
    updateProduct: async (id: number, productData: any) => {
      const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(productData),
      });
      return handleResponse(res);
    },
    deleteProduct: async (id: number) => {
      const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getCoupons: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/coupons`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    createCoupon: async (couponData: any) => {
      const res = await fetch(`${API_BASE_URL}/admin/coupons`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(couponData),
      });
      return handleResponse(res);
    },
    deleteCoupon: async (id: number) => {
      const res = await fetch(`${API_BASE_URL}/admin/coupons/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  }
};
