'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Download as DownloadIcon, Apple, Smartphone, Monitor, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const GITHUB_REPO = 'mahendra189/drivingvibes';
const LATEST_RELEASE_URL = `https://github.com/${GITHUB_REPO}/releases/latest`;

const platforms = [
    {
        name: 'Mac Receiver',
        icon: Apple,
        description: 'The receiver application for your macOS computer. Simulates keyboard and mouse input for steering control.',
        image: '/mac-mockup.png',
        features: [
            'macOS 10.13 or later',
            'Standalone application bundle',
            'Easy accessibility setup',
        ],
        downloadText: 'Download for Mac',
        downloadUrl: `https://github.com/${GITHUB_REPO}/releases/latest/download/SteerByPhone-Mac-latest.zip`,
        // Fallback to latest release page if direct download doesn't work
        fallbackUrl: LATEST_RELEASE_URL,
    },
    {
        name: 'Windows Receiver',
        icon: Monitor,
        description: 'The receiver application for your Windows PC. Uses vJoy to simulate a virtual joystick for racing games.',
        image: '/windows-mockup.png',
        features: [
            'Windows 10 or later',
            'vJoy driver support',
            'Virtual joystick simulation',
        ],
        downloadText: 'Download for Windows',
        downloadUrl: `https://github.com/${GITHUB_REPO}/releases/latest/download/SteerByPhone-Windows-latest.exe`,
        fallbackUrl: LATEST_RELEASE_URL,
    },
    {
        name: 'Mobile Client',
        icon: Smartphone,
        description: 'The mobile app for your Android smartphone. Uses your phone\'s sensors to detect steering movements.',
        image: '/phone-mockup.png',
        features: [
            'Android 5.0 or later',
            'Accelerometer & gyroscope support',
            'Intuitive touch interface',
        ],
        downloadText: 'Download APK',
        downloadUrl: `https://github.com/${GITHUB_REPO}/releases/latest/download/SteerByPhone-Android-latest.apk`,
        fallbackUrl: LATEST_RELEASE_URL,
    },
];

export default function Download() {
    return (
        <section id="download" className="py-24 px-4 relative bg-secondary/20">
            <div className="container mx-auto max-w-7xl relative z-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 space-y-4"
                >
                    <h2 className="text-4xl md:text-5xl font-bold">
                        Download Now
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Get all apps and start your racing adventure today. Completely free and open source.
                    </p>
                </motion.div>

                {/* Download cards */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {platforms.map((platform, index) => (
                        <motion.div
                            key={platform.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow border-border/50">
                                <CardHeader className="space-y-4">
                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <platform.icon className="w-7 h-7 text-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <CardTitle className="text-2xl">{platform.name}</CardTitle>
                                        <CardDescription className="text-base leading-relaxed">
                                            {platform.description}
                                        </CardDescription>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {/* Features list */}
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        {platform.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Download button */}
                                    <Button
                                        asChild
                                        className="w-full"
                                        size="lg"
                                    >
                                        <a
                                            href={platform.downloadUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <DownloadIcon className="w-5 h-5 mr-2" />
                                            {platform.downloadText}
                                        </a>
                                    </Button>

                                    {/* Image preview */}
                                    <div className="rounded-lg overflow-hidden border border-border">
                                        <Image
                                            src={platform.image}
                                            alt={`${platform.name} App`}
                                            width={400}
                                            height={300}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Additional info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 text-center space-y-4"
                >
                    <Button variant="link" asChild>
                        <a
                            href={LATEST_RELEASE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View all releases on GitHub
                        </a>
                    </Button>

                    <div className="text-sm text-muted-foreground">
                        Need help? Check out the{' '}
                        <a
                            href={`https://github.com/${GITHUB_REPO}#readme`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            documentation
                        </a>
                        {' '}or{' '}
                        <a
                            href={`https://github.com/${GITHUB_REPO}/blob/main/BUILD_GUIDE.md`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            build guide
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
