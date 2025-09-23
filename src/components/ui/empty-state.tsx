'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('text-center py-12', className)}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    delay: 0.2,
                    type: 'spring',
                    stiffness: 200,
                }}
                className="mx-auto mb-4"
            >
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
            </motion.div>

            <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg font-medium mb-2"
            >
                {title}
            </motion.h3>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-6 max-w-md mx-auto"
            >
                {description}
            </motion.p>

            {action && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Button onClick={action.onClick}>
                        {action.label}
                    </Button>
                </motion.div>
            )}
        </motion.div>
    );
}
