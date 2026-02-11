import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: string; // e.g., 'blue', 'green', 'purple'
}

const colorMap: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
};

export default function StatsCard({ title, value, subtitle, icon: Icon, trend, color = 'primary' }: StatsCardProps) {
    return (
        <motion.div
            className="bg-white p-6 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group"
            whileHover={{
                y: -4,
                boxShadow: '8px_8px_0px_0px_rgba(0,0,0,1)',
            }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                    <p className="text-sm font-black text-muted-foreground uppercase tracking-wider">{title}</p>
                    <h3 className="text-4xl font-black mt-2 tracking-tight">{value}</h3>
                    {subtitle && <p className="text-xs font-bold text-muted-foreground mt-1">{subtitle}</p>}

                    {trend && (
                        <div className={`flex items-center gap-1 mt-3 text-sm font-black ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            <span className="text-lg">{trend.isPositive ? '↗' : '↘'}</span>
                            <span>{Math.abs(trend.value)}%</span>
                            <span className="text-muted-foreground font-medium text-xs ml-1">vs last month</span>
                        </div>
                    )}
                </div>

                <div className={`p-3 rounded-lg border-2 border-black ${colorMap[color] || colorMap.primary}`}>
                    <Icon className="h-8 w-8" />
                </div>
            </div>

            {/* Background decorative pattern */}
            <div className="absolute -right-6 -bottom-6 opacity-5 transform rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                <Icon className="h-32 w-32" />
            </div>
        </motion.div>
    );
}
