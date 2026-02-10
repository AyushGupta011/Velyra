"use client";

import { OrderStatus } from '@prisma/client';

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: string }> = {
    PENDING: {
        label: 'Pending',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100 border-yellow-700',
        icon: '⏳',
    },
    PAID: {
        label: 'Paid',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100 border-blue-700',
        icon: '💳',
    },
    PROCESSING: {
        label: 'Processing',
        color: 'text-purple-700',
        bgColor: 'bg-purple-100 border-purple-700',
        icon: '⚙️',
    },
    SHIPPED: {
        label: 'Shipped',
        color: 'text-orange-700',
        bgColor: 'bg-orange-100 border-orange-700',
        icon: '📦',
    },
    DELIVERED: {
        label: 'Delivered',
        color: 'text-green-700',
        bgColor: 'bg-green-100 border-green-700',
        icon: '✅',
    },
    CANCELLED: {
        label: 'Cancelled',
        color: 'text-red-700',
        bgColor: 'bg-red-100 border-red-700',
        icon: '❌',
    },
};

interface OrderStatusBadgeProps {
    status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-black border-2 ${config.bgColor} ${config.color}`}>
            <span>{config.icon}</span>
            <span>{config.label}</span>
        </span>
    );
}
