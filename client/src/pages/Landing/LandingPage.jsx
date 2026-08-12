import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, User, Building, ShieldCheck } from 'lucide-react';
import Topbar from '../../components/layout/Topbar';
import useAuth from '../../features/auth/hooks/useAuth';

const LandingPage = () => {
    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'About Us', href: '#about' },
        { name: 'Colleges', href: '#roles' },
        { name: 'Contact Us', href: '#contact' },
    ];

    const { user } = useAuth(false);

    // Prevent management roles from accessing landing page
    if (user && user.role !== 'student') {
        if (user.role === 'admin' || user.role === 'editor')
            return <Navigate to="/admin/dashboard" replace />;
        if (user.role === 'college')
            return <Navigate to="/college/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--color-amber-200)] selection:text-[var(--color-ink-950)]">
            <Topbar transparentOnTop={true} />

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden stagger-1">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/hero-bg.jpg"
                        alt="University Campus"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-[var(--color-ink-950)]/60"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-ink-950)]/40 to-[var(--background)]"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto stagger-in mt-16">
                    <h1 className="text-5xl md:text-7xl font-display font-medium text-white tracking-tight mb-6 drop-shadow-lg">
                        Inspire{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-amber-300)] to-[var(--color-amber-500)] italic">
                            Impact
                        </span>
                    </h1>
                    <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        It's all about the way we{' '}
                        <span className="font-medium text-[var(--color-amber-200)]">
                            think
                        </span>
                        , <span className="font-medium text-white">teach</span>,{' '}
                        <span className="font-medium text-[var(--color-amber-200)]">
                            build
                        </span>
                        , and{' '}
                        <span className="font-medium text-white">grow</span>.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a
                            href="#roles"
                            className="btn-primary flex items-center gap-2"
                        >
                            Get Started <ArrowRight className="w-5 h-5" />
                        </a>
                        <Link
                            to="/college"
                            className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-[var(--radius-md)] font-medium text-lg transition-all"
                        >
                            Explore Colleges
                        </Link>
                        <Link
                            to="/exams"
                            className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-[var(--radius-md)] font-medium text-lg transition-all"
                        >
                            Explore Exams
                        </Link>
                    </div>
                </div>
            </section>

            {/* Roles Section */}
            <section id="roles" className="py-24 px-4 surface-paper stagger-2">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl mb-4 text-[var(--foreground)] font-display">
                            I am a...
                        </h2>
                        <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
                            Join our platform to manage your educational
                            journey, review institutions, or oversee campus
                            operations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Student Card */}
                        <div className="card-interactive relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-amber-500)]/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
                            <div className="w-14 h-14 bg-[var(--color-amber-100)] text-[var(--color-amber-600)] rounded-[var(--radius-md)] flex items-center justify-center mb-6">
                                <User className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl mb-3 font-display">
                                Student
                            </h3>
                            <p className="text-[var(--muted)] mb-8">
                                Discover colleges, read verified reviews, and
                                participate in community discussions about
                                campus life.
                            </p>
                            <Link
                                to="/signup"
                                className="inline-flex items-center gap-2 text-[var(--color-amber-600)] font-semibold group-hover:gap-3 transition-all"
                            >
                                Join as Student{' '}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* College Rep Card */}
                        <div className="card-interactive relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-ink-500)]/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
                            <div className="w-14 h-14 bg-[var(--color-ink-100)] text-[var(--color-ink-600)] rounded-[var(--radius-md)] flex items-center justify-center mb-6">
                                <Building className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl mb-3 font-display">
                                College Rep
                            </h3>
                            <p className="text-[var(--muted)] mb-8">
                                Claim your institution, manage public profiles,
                                and keep placement and faculty records up to
                                date.
                            </p>
                            <Link
                                to="/signup"
                                className="inline-flex items-center gap-2 text-[var(--color-ink-600)] font-semibold group-hover:gap-3 transition-all"
                            >
                                Register College{' '}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Admin Card */}
                        <div className="card-interactive relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-danger)]/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
                            <div className="w-14 h-14 bg-[var(--color-danger)]/10 text-[var(--color-danger)] rounded-[var(--radius-md)] flex items-center justify-center mb-6">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl mb-3 font-display">
                                Administrator
                            </h3>
                            <p className="text-[var(--muted)] mb-8">
                                Platform management, review moderation, and
                                overseeing institutional data integrity across
                                the system.
                            </p>
                            <Link
                                to="/signin"
                                className="inline-flex items-center gap-2 text-[var(--color-danger)] font-semibold group-hover:gap-3 transition-all"
                            >
                                Admin Login <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer
                id="about"
                className="bg-[var(--color-ink-950)] pt-16 pb-8 border-t border-[var(--color-ink-800)]"
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-[var(--color-ink-800)] rounded flex items-center justify-center text-[var(--color-amber-300)] font-display font-bold shadow-lg">
                                    SD
                                </div>
                                <span className="text-xl font-display font-semibold text-white">
                                    Student Dashboard
                                </span>
                            </div>
                            <p className="text-[var(--color-ink-300)] max-w-sm">
                                Empowering students to make informed decisions
                                about their academic future with verified data
                                and authentic reviews.
                            </p>
                        </div>

                        <div id="contact">
                            <h4 className="text-white font-display mb-4">
                                Quick Links
                            </h4>
                            <ul className="space-y-2">
                                {navLinks.map(link => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-[var(--color-ink-300)] hover:text-[var(--color-amber-300)] transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-display mb-4">
                                Contact
                            </h4>
                            <ul className="space-y-2 text-[var(--color-ink-300)]">
                                <li>info@studentdashboard.edu</li>
                                <li>+1 (555) 123-4567</li>
                                <li>123 Education Ave, Tech City</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-[var(--color-ink-800)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-[var(--color-ink-400)] text-sm">
                            © {new Date().getFullYear()} Student Dashboard. All
                            rights reserved.
                        </p>
                        <div className="flex gap-4 text-[var(--color-ink-400)]">
                            <a
                                href="#"
                                className="hover:text-white transition-colors"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="hover:text-white transition-colors"
                            >
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
