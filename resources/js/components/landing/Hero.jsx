import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../css/landingpage/hero.css';

const slides = [
    '/images/hero/hero-img-1.jpg',
    '/images/hero/hero-img-2.jpg',
    '/images/hero/hero-img-3.jpg',
];

export default function Hero() {
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="home" className="hero-section">
            {slides.map((img, index) => (
                <div
                    key={index}
                    className={`hero-slide ${index === current ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${img})` }}
                />
            ))}

            <div className="carousel-overlay d-flex flex-column justify-content-center text-start text-white">
                <h1 className="hero-heading animate-slide">
                    JOSELINE International
                </h1>
                <h2 className="hero-heading-two animate-slide">
                    Manpower Corporation
                </h2>
                <p className="hero-subheading animate-slide-delay">
                    Your Trusted Partner in Workforce Solutions.
                </p>
                <div className="hero-buttons mt-3 animate-slide-delay">
                    <button className="btn btn-primary me-3">
                        Get Started
                    </button>
                    <button className="btn btn-outline-light"
                        onClick={() => navigate('/register')}
                    >
                        Book an Appointment
                    </button>
                </div>
            </div>
        </section>
    );
}