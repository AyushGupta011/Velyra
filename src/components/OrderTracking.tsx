"use client";

import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

interface OrderTrackingProps {
    status: string;
    trackingNumber?: string;
    createdAt: Date;
}

const statusSteps = [
    { key: 'PENDING', label: 'Order Placed', icon: Clock },
    { key: 'PROCESSING', label: 'Processing', icon: Package },
    { key: 'PAID', label: 'Payment Confirmed', icon: CheckCircle },
    { key: 'SHIPPED', label: 'Shipped', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
];

const getStatusIndex = (status: string) => {
    const index = statusSteps.findIndex(step => step.key === status);
    return index >= 0 ? index : 0;
};

export default function OrderTracking({ status, trackingNumber, createdAt }: OrderTrackingProps) {
    const currentIndex = getStatusIndex(status);
    const isCancelled = status === 'CANCELLED';

    if (isCancelled) {
        return (
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
                <div className="flex items-center gap-3 text-red-700">
                    <XCircle className="h-8 w-8" />
                    <div>
                        <h3 className="text-xl font-black">Order Cancelled</h3>
                        <p className="text-sm">This order has been cancelled</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-6">
                <h3 className="text-2xl font-black mb-2">Order Tracking</h3>
                {trackingNumber && (
                    <p className="text-sm text-muted-foreground">
                        Tracking Number: <span className="font-mono font-bold">{trackingNumber}</span>
                    </p>
                )}
            </div>

            <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-200" />
                <motion.div
                    className="absolute left-6 top-0 w-1 bg-primary"
                    initial={{ height: 0 }}
                    animate={{ height: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                />

                {/* Status Steps */}
                <div className="space-y-8">
                    {statusSteps.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;

                        return (
                            <motion.div
                                key={step.key}
                                className="relative flex items-start gap-4"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {/* Icon */}
                                <motion.div
                                    className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${isCompleted
                                            ? 'bg-primary border-primary text-white'
                                            : 'bg-white border-gray-300 text-gray-400'
                                        }`}
                                    animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    <Icon className="h-6 w-6" />
                                </motion.div>

                                {/* Content */}
                                <div className="flex-1 pt-2">
                                    <h4 className={`font-bold text-lg ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        {step.label}
                                    </h4>
                                    {isCurrent && (
                                        <p className="text-sm text-primary font-bold mt-1">
                                            Current Status
                                        </p>
                                    )}
                                    {isCompleted && !isCurrent && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Completed
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Estimated Delivery */}
            {status === 'SHIPPED' && (
                <motion.div
                    className="mt-6 p-4 bg-primary/10 border-2 border-primary rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="font-bold text-primary">
                        Estimated Delivery: {new Date(new Date(createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                </motion.div>
            )}
        </div>
    );
}
