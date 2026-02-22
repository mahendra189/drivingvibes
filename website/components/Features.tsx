'use client';

import { motion } from 'framer-motion';
import { Smartphone, Wifi, Zap, Shield, Gauge, Cpu } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
    {
        icon: Smartphone,
        title: 'Smartphone Control',
        description: 'Use your phone\'s accelerometer and gyroscope for precise steering control.',
    },
    {
        icon: Wifi,
        title: 'Wireless Connection',
        description: 'Connect seamlessly over your local WiFi network. No cables required.',
    },
    {
        icon: Zap,
        title: 'Low Latency',
        description: 'Real-time response with minimal delay for the best gaming experience.',
    },
    {
        icon: Shield,
        title: 'Open Source',
        description: 'Completely free and open source. Customize it to your needs.',
    },
    {
        icon: Gauge,
        title: 'Racing Optimized',
        description: 'Designed specifically for racing games with fine-tuned sensitivity.',
    },
    {
        icon: Cpu,
        title: 'Multi-Platform',
        description: 'Works on macOS, Windows, and Android with dedicated applications.',
    },
];

export default function Features() {
    return (
        <section id="features" className="py-24 px-4 relative bg-secondary/20">
            <div className="container mx-auto max-w-7xl">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 space-y-4"
                >
                    <h2 className="text-4xl md:text-5xl font-bold">
                        Powerful Features
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Everything you need for an immersive racing experience, right in your pocket.
                    </p>
                </motion.div>

                {/* Features grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow border-border/50">
                                <CardHeader className="space-y-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <feature.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
