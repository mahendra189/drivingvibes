'use client';

import { motion } from 'framer-motion';
import { Download, Wifi, Play, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const steps = [
    {
        number: '01',
        icon: Download,
        title: 'Download Apps',
        description: 'Get the receiver app for your computer (Mac/Windows) and the mobile client for your Android phone.',
    },
    {
        number: '02',
        icon: Wifi,
        title: 'Connect to WiFi',
        description: 'Make sure both your computer and phone are connected to the same WiFi network.',
    },
    {
        number: '03',
        icon: Play,
        title: 'Launch & Connect',
        description: 'Start the receiver on your computer, then connect from your phone using the displayed IP address.',
    },
    {
        number: '04',
        icon: CheckCircle2,
        title: 'Start Racing!',
        description: 'Open your favorite racing game and start steering with your phone. Enjoy the ride!',
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 px-4 relative">
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
                        How It Works
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Get started in just 4 simple steps. No technical expertise required.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative"
                        >
                            {/* Connection line */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-border -z-10" />
                            )}

                            <Card className="relative h-full hover:shadow-lg transition-shadow border-border/50">
                                <CardHeader className="space-y-4">
                                    {/* Step number */}
                                    <div className="text-5xl font-bold text-muted/20">
                                        {step.number}
                                    </div>

                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <step.icon className="w-7 h-7 text-primary" />
                                    </div>

                                    <CardTitle className="text-xl">{step.title}</CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed">
                                        {step.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Visual flow indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 text-center"
                >
                    <Badge variant="secondary" className="px-6 py-3 text-base">
                        <CheckCircle2 className="w-5 h-5 mr-2 text-primary" />
                        Ready to race in under 5 minutes!
                    </Badge>
                </motion.div>
            </div>
        </section>
    );
}
