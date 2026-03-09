import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={`navbar navbar-expand-lg fixed-top px-5 custom-navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="container">

                <a className="navbar-brand d-flex align-items-center" href="#home">
                    <img
                        src="/images/agency_logo.png"
                        alt="Agency Logo"
                        className="me-2 logo-img"
                    />
                </a>

                <button
                    className="navbar-toggler custom-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav gap-lg-4 nav-links">
                        <li className="nav-item">
                            <a className="nav-link text-white" href="#home">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white" href="#about">About Us</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white" href="#services">Services</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white" href="#featured">Featured Jobs</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white" href="#why">Why Choose Us</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white" href="#contact">Contact</a>
                        </li>

                        <li className="nav-item">
                            <Link
                                to="/login"
                                className="btn btn-outline-light rounded-pill ms-2"
                                style={{ padding: '0.35rem 1rem' }}
                            >
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}