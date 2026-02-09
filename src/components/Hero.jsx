import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Clock, Tag } from 'lucide-react';
import heroImg from '../assets/supermarket_hero_1770537710091.png';

const Hero = () => {
    return (
        <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background with overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroImg}
                    alt="Fresh Supermarket"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
            </div>

            <div className="container relative z-10">
                <div className="max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 bg-primary-light-val/10 text-primary-val px-4 py-1 rounded-full font-bold mb-6">
                            <Leaf size={16} /> FRESH & ORGANIC EVERY DAY
                        </span>
                        <h1 className="text-6xl md:text-7xl font-black text-text-val mb-6">
                            Your Kitchen's <br />
                            <span className="text-primary-val">Best Friend</span>
                        </h1>
                        <p className="text-xl text-text-muted-val mb-10 leading-relaxed">
                            Discover the freshest produce, premium meats, and artisan bakery items.
                            Save big with our weekly digital flyer discounts.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <a href="#deals" className="btn btn-primary text-lg px-8 py-4">
                                View Weekly Deals <ArrowRight size={20} />
                            </a>
                            <a href="#categories" className="btn bg-white border-2 border-primary-val text-primary-val text-lg px-8 py-4 hover:bg-primary-val/5">
                                Browse Aisles
                            </a>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-accent/20 rounded-2xl text-accent">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold">Fast Pickup</h4>
                                    <p className="text-sm text-text-muted">In-store in 30m</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-secondary/20 rounded-2xl text-secondary">
                                    <Tag size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold">Weekly Savings</h4>
                                    <p className="text-sm text-text-muted-val">Up to 50% Off</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Decorative fruit slices floating could be cool, but keeping it clean for now */}

        </section>
    );
};

export default Hero;
