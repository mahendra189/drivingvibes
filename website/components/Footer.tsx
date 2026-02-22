'use client';

import { Github, Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export default function Footer() {
    return (
        <footer className="relative py-12 px-4 border-t border-border">
            <div className="container mx-auto max-w-7xl">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            SteerByPhone
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Transform your smartphone into a powerful steering wheel for PC racing games.
                            Free, open source, and easy to use.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-3">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Button variant="link" asChild className="h-auto p-0 text-muted-foreground hover:text-foreground">
                                    <a href="#features">Features</a>
                                </Button>
                            </li>
                            <li>
                                <Button variant="link" asChild className="h-auto p-0 text-muted-foreground hover:text-foreground">
                                    <a href="#how-it-works">How It Works</a>
                                </Button>
                            </li>
                            <li>
                                <Button variant="link" asChild className="h-auto p-0 text-muted-foreground hover:text-foreground">
                                    <a href="#download">Download</a>
                                </Button>
                            </li>
                            <li>
                                <Button variant="link" asChild className="h-auto p-0 text-muted-foreground hover:text-foreground">
                                    <a
                                        href="https://github.com/mahendra189/drivingvibes"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        GitHub Repository
                                    </a>
                                </Button>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold mb-3">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Button variant="link" asChild className="h-auto p-0 text-muted-foreground hover:text-foreground">
                                    <a
                                        href="https://github.com/mahendra189/drivingvibes#readme"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Documentation
                                    </a>
                                </Button>
                            </li>
                            <li>
                                <Button variant="link" asChild className="h-auto p-0 text-muted-foreground hover:text-foreground">
                                    <a
                                        href="https://github.com/mahendra189/drivingvibes/blob/main/BUILD_GUIDE.md"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Build Guide
                                    </a>
                                </Button>
                            </li>
                            <li>
                                <Button variant="link" asChild className="h-auto p-0 text-muted-foreground hover:text-foreground">
                                    <a
                                        href="https://github.com/mahendra189/drivingvibes/issues"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Report Issues
                                    </a>
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="mb-8" />

                {/* Bottom bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by the SteerByPhone Team
                    </div>

                    <div className="flex items-center gap-6">
                        <Button variant="ghost" size="sm" asChild>
                            <a
                                href="https://github.com/mahendra189/drivingvibes"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                            >
                                <Github className="w-5 h-5" />
                                <span className="text-sm">Open Source</span>
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="mt-6 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} SteerByPhone. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
