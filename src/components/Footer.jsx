import React from 'react';
import { ShoppingBasket, Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="locations" className="bg-text text-white pt-20 pb-10">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-primary p-2 rounded-lg">
                                <ShoppingBasket size={24} />
                            </div>
                            <span className="text-xl font-black">FRESH<span className="text-accent">MART</span></span>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Your neighborhood grocery store committed to quality, freshness, and community.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-primary transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-primary transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-primary transition-colors"><Twitter size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-primary transition-colors">Weekly Flyer</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Coupons</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Recipes</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Support</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Contact Info</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex gap-3"><MapPin className="text-primary flex-shrink-0" size={20} /> 123 Fresh Ave, Grocery City</li>
                            <li className="flex gap-3"><Phone className="text-primary flex-shrink-0" size={20} /> (555) 123-4567</li>
                            <li className="flex gap-3"><Mail className="text-primary flex-shrink-0" size={20} /> hello@freshmart.com</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-sm">© 2025 FreshMart Supermarket. All rights reserved.</p>
                    <div className="flex gap-8 text-sm text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
