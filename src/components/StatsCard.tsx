import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

const StatsCard = ({ title, value, subtitle, icon: Icon, trend, delay = 0 }: StatsCardProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }} className="card-glass group">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs md:text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-xs md:text-sm text-muted-foreground">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? "text-primary" : "text-destructive"}`}>
              <span>
                {trend.isPositive ? "+" : "-"}
                {trend.value}%
              </span>
              <span className="text-muted-foreground">this month</span>
            </div>
          )}
        </div>

        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors group-hover:glow-primary">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
