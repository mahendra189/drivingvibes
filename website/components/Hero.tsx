'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 bg-gradient-to-b from-background via-background to-secondary/20">
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:32px_32px]" />

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left space-y-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Badge variant="secondary" className="px-4 py-2 text-sm">
                                <Gamepad2 className="w-4 h-4 mr-2" />
                                Revolutionary Racing Control
                            </Badge>
                        </motion.div>

                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                                Turn Your Phone Into a{' '}
                                <span className="text-primary">Steering Wheel</span>
                            </h1>

                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Experience the thrill of racing games with your smartphone as a real steering wheel.
                                <span className="text-foreground font-medium"> No extra hardware needed.</span>
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button
                                asChild
                                size="lg"
                                className="text-lg px-8 h-12"
                            >
                                <motion.a
                                    href="#download"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Download Now
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </motion.a>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="text-lg px-8 h-12"
                            >
                                <motion.a
                                    href="#how-it-works"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    How It Works
                                </motion.a>
                            </Button>
                        </div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="grid grid-cols-3 gap-8 pt-8 border-t border-border"
                        >
                            <div className="space-y-1">
                                <div className="text-3xl font-bold text-primary">Free</div>
                                <div className="text-sm text-muted-foreground">Open Source</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-bold text-primary">3</div>
                                <div className="text-sm text-muted-foreground">Platforms</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-bold text-primary">Easy</div>
                                <div className="text-sm text-muted-foreground">Setup</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right content - Phone mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex justify-center"
                    >
                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 2, 0, -2, 0]
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative"
                        >
                            <Image
                                src="/phone-mockup.png"
                                alt="SteerByPhone App Interface"
                                width={500}
                                height={500}
                                className="w-full max-w-md h-auto drop-shadow-2xl"
                                priority
                            />

                            {/* Subtle glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2"
                >
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    );
}
