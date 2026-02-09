import React from 'react';
import { motion } from 'framer-motion';
import fruitImg from '../assets/fruits_veg_category_1770537728419.png';
import bakeryImg from '../assets/bakery_category_1770537743265.png';

const categories = [
    { id: 1, name: 'Fruits & Veggies', icon: '🍎', image: fruitImg, count: '120+ Items' },
    { id: 2, name: 'Artisan Bakery', icon: '🥐', image: bakeryImg, count: '45+ Items' },
    { id: 3, name: 'Dairy & Eggs', icon: '🥛', color: '#457B9D', count: '80+ Items' },
    { id: 4, name: 'Meat & Poultry', icon: '🥩', color: '#E63946', count: '60+ Items' },
    { id: 5, name: 'Pantry Staples', icon: '🍞', color: '#F4A261', count: '200+ Items' },
];

const CategorySection = () => {
    return (
        <section id="categories" className="bg-white">
            <div className="container">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <span className="text-accent-val font-bold tracking-widest uppercase">Categories</span>
                        <h2 className="text-4xl md:text-5xl font-black mt-2">Explore Our <span className="text-primary-val">Aisles</span></h2>
                    </div>
                    <p className="text-text-muted-val max-w-md">
                        From farm-fresh organic produce to daily baked breads, find everything you need for your kitchen.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -10 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative group cursor-pointer overflow-hidden rounded-3xl h-64 shadow-lg"
                        >
                            {cat.image ? (
                                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                                <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: cat.color }}></div>
                            )}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                            <div className="absolute bottom-0 left-0 p-6 text-white">
                                <span className="text-3xl mb-2 block">{cat.icon}</span>
                                <h3 className="text-xl font-bold">{cat.name}</h3>
                                <p className="text-sm opacity-80">{cat.count}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;
