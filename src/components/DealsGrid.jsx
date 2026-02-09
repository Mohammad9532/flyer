import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Plus, Percent } from 'lucide-react';

const deals = [
    { id: 1, name: 'Premium Avocado', brand: 'Organic Farm', price: 1.49, oldPrice: 2.99, badge: '50% OFF', category: 'Fruits' },
    { id: 2, name: 'Strawberries 500g', brand: 'Fresh Pick', price: 3.99, oldPrice: 5.49, badge: 'WEEKLY DEAL', category: 'Fruits' },
    { id: 3, name: 'Whole Wheat Bread', brand: 'Bakery Co', price: 2.50, oldPrice: 3.20, badge: 'BOGO', category: 'Bakery' },
    { id: 4, name: 'Oat Milk 1L', brand: 'Earthly', price: 1.99, oldPrice: 2.75, badge: 'LOW PRICE', category: 'Dairy' },
    { id: 5, name: 'Ribeye Steak', brand: 'Butcher Select', price: 12.99, oldPrice: 15.99, badge: 'SAVE $3', category: 'Meat' },
    { id: 6, name: 'Bell Peppers Mix', brand: 'Garden Fresh', price: 2.99, oldPrice: 4.50, badge: 'HOT DEAL', category: 'Veggies' },
];

const DealCard = ({ deal }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group"
    >
        {deal.badge && (
            <div className="absolute top-4 left-4 z-10">
                <span className="bg-secondary text-white text-xs font-black px-3 py-1 rounded-full shadow-sm">
                    {deal.badge}
                </span>
            </div>
        )}

        <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-50 text-gray-400 hover:text-secondary hover:bg-secondary/10 transition-all">
            <Heart size={18} />
        </button>

        <div className="h-48 mb-6 flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden group-hover:bg-primary/5 transition-colors">
            <div className="text-4xl filter grayscale group-hover:grayscale-0 transition-all scale-150">
                {deal.id === 1 && '🥑'}
                {deal.id === 2 && '🍓'}
                {deal.id === 3 && '🍞'}
                {deal.id === 4 && '🥛'}
                {deal.id === 5 && '🥩'}
                {deal.id === 6 && '🫑'}
            </div>
        </div>

        <div>
            <p className="text-xs font-bold text-primary-val mb-1 uppercase tracking-wider">{deal.category}</p>
            <h3 className="text-xl font-bold text-text-val mb-1">{deal.name}</h3>
            <p className="text-sm text-text-muted-val mb-4">{deal.brand}</p>

            <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-secondary-val">${deal.price}</span>
                    {deal.oldPrice && (
                        <span className="text-sm text-gray-400 line-through">${deal.oldPrice}</span>
                    )}
                </div>
                <button className="bg-primary text-white p-3 rounded-2xl hover:bg-primary-light transition-colors shadow-lg active:scale-95">
                    <Plus size={20} />
                </button>
            </div>
        </div>
    </motion.div>
);

const DealsGrid = () => {
    return (
        <section id="deals" className="bg-background">
            <div className="container">
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-1 rounded-full font-bold mb-4">
                        <Percent size={16} /> WEEKLY SAVINGS FLYER
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-4">This Week's <span className="text-secondary-val">Hot Picks</span></h2>
                    <p className="text-text-muted-val max-w-xl">
                        Grab these limited-time deals before they're gone! Digital exclusive prices for our loyalty members.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {deals.map((deal) => (
                        <DealCard key={deal.id} deal={deal} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="btn btn-primary px-10 py-4 text-lg">
                        Download Full PDF Flyer
                    </button>
                </div>
            </div>
        </section>
    );
};

export default DealsGrid;
