export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    category: string;
}

export interface Cart {
    items: CartItem[];
    total: number;
    itemCount: number;
}

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export interface Order {
    id: string;
    userId?: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    shippingAddress?: {
        name: string;
        email: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
