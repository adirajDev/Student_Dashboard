import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, User, Building, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'About Us', href: '#about' },
        { name: 'Colleges', href: '#roles' },
        { name: 'Contact Us', href: '#contact' },
    ];

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-indigo-500 selection:text-white font-sans">
            {/* Header */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm py-3'
                        : 'bg-transparent py-5'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            SD
                        </div>
                        <span className={`text-xl font-bold ${scrolled ? 'text-[var(--foreground)]' : 'text-white'}`}>
                            Student Dashboard
                        </span>
                    </div>

                    <nav className="hidden md:flex gap-8 items-center">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium hover:text-indigo-500 transition-colors ${
                                    scrolled ? 'text-[var(--foreground)]' : 'text-white/90'
                                }`}
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/dashboard-redirect"
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                                scrolled
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                                    : 'bg-white text-indigo-900 hover:bg-slate-100'
                            }`}
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/hero-bg.jpg"
                        alt="University Campus"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[var(--background)]"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-fade-in-up mt-16">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg">
                        Inspire <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Impact</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto font-light drop-shadow-md">
                        It's all about the way we <span className="font-semibold text-cyan-300">think</span>,{' '}
                        <span className="font-semibold text-indigo-300">teach</span>,{' '}
                        <span className="font-semibold text-pink-300">build</span>, and{' '}
                        <span className="font-semibold text-yellow-300">grow</span>.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a
                            href="#roles"
                            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2"
                        >
                            Get Started <ArrowRight className="w-5 h-5" />
                        </a>
                        <Link
                            to="/search"
                            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full font-semibold text-lg transition-all"
                        >
                            Explore Colleges
                        </Link>
                    </div>
                </div>
            </section>

            {/* Roles Section */}
            <section id="roles" className="py-24 px-4 bg-[var(--background)]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[var(--foreground)]">I am a...</h2>
                        <p className="text-[var(--ring)] text-lg max-w-2xl mx-auto">
                            Join our platform to manage your educational journey, review institutions, or oversee campus operations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Student Card */}
                        <div className="group relative bg-[var(--card)] rounded-3xl p-8 border border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                                <User className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Student</h3>
                            <p className="text-[var(--ring)] mb-8">
                                Discover colleges, read verified reviews, and participate in community discussions about campus life.
                            </p>
                            <Link
                                to="/signup"
                                className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:gap-3 transition-all"
                            >
                                Join as Student <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* College Rep Card */}
                        <div className="group relative bg-[var(--card)] rounded-3xl p-8 border border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                                <Building className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">College Rep</h3>
                            <p className="text-[var(--ring)] mb-8">
                                Claim your institution, manage public profiles, and keep placement and faculty records up to date.
                            </p>
                            <Link
                                to="/signup"
                                className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold group-hover:gap-3 transition-all"
                            >
                                Register College <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Admin Card */}
                        <div className="group relative bg-[var(--card)] rounded-3xl p-8 border border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                            <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-6">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Administrator</h3>
                            <p className="text-[var(--ring)] mb-8">
                                Platform management, review moderation, and overseeing institutional data integrity across the system.
                            </p>
                            <Link
                                to="/signin"
                                className="inline-flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold group-hover:gap-3 transition-all"
                            >
                                Admin Login <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="about" className="bg-slate-900 pt-16 pb-8 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                                    SD
                                </div>
                                <span className="text-xl font-bold text-white">Student Dashboard</span>
                            </div>
                            <p className="text-slate-400 max-w-sm">
                                Empowering students to make informed decisions about their academic future with verified data and authentic reviews.
                            </p>
                        </div>
                        
                        <div id="contact">
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                {navLinks.map(link => (
                                    <li key={link.name}>
                                        <a href={link.href} className="text-slate-400 hover:text-white transition-colors">
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-slate-400">
                                <li>info@studentdashboard.edu</li>
                                <li>+1 (555) 123-4567</li>
                                <li>123 Education Ave, Tech City</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">
                            © {new Date().getFullYear()} Student Dashboard. All rights reserved.
                        </p>
                        <div className="flex gap-4 text-slate-500">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
