import React from "react";
import Navbar from "../components/landing/Navbar.jsx";
import Hero from "../components/landing/Hero.jsx";
import About from "../components/landing/About.jsx";
import Services from "../components/landing/Services.jsx";
import Featured from "../components/landing/Featured.jsx";
import WhyChooseUs from "../components/landing/WhyChooseUs.jsx";
import Contact from "../components/landing/Contact.jsx";
import Footer from "../components/landing/Footer.jsx";

export default function LandingPage() {
    return (
        <div>
            <Navbar />
            <Hero />
            <About />
            <Services />
            <Featured />
            <WhyChooseUs />
            <Contact />
            <Footer />
        </div>
    );
}