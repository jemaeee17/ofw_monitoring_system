import React from 'react';
import '../../../css/landingpage/services.css';

export default function Services() {
    const services = [
        {
            title: "Recruitment & Placement",
            description: "Connecting skilled workers with trusted employers locally and abroad.",
            image: "/images/services/services-img-1.jpg",
            icon: "bi-people-fill"
        },
        {
            title: "Overseas Employment",
            description: "Providing opportunities for global careers with reliable support.",
            image: "/images/services/services-img-2.jpg",
            icon: "bi-globe2"
        },
        {
            title: "Documentation Assistance",
            description: "Helping applicants with fast and accurate processing of requirements.",
            image: "/images/services/services-img-3.jpg",
            icon: "bi-file-earmark-text"
        },
        {
            title: "Employer Staffing Solutions",
            description: "Supplying qualified manpower tailored to business needs.",
            image: "/images/services/services-img-4.jpg",
            icon: "bi-briefcase-fill"
        },
        {
            title: "Training & Orientation",
            description: "Preparing candidates with the skills needed for success.",
            image: "/images/services/services-img-5.jpg",
            icon: "bi-mortarboard-fill"
        },
        {
            title: "Career Support Services",
            description: "Guiding workers from application to deployment and beyond.",
            image: "/images/services/services-img-6.jpg",
            icon: "bi-chat-dots-fill"
        },
    ];

    return (
        <section id="services" className="services-section">
            <div className="container">
                <div className="text-center mb-5">
                    <p className="services-subtitle text-primary">What We Offer</p>
                    <h2 className="services-heading">Our Services</h2>
                </div>

                <div className="row g-4">
                    {services.map((service, index) => (
                        <div className="col-lg-4 col-md-6" key={index}>
                            <div
                                className="service-card"
                                style={{ backgroundImage: `url(${service.image})` }}
                            >
                                <div className="service-overlay"></div>

                                <div className="service-content">
                                    <i className={`service-icon ${service.icon}`}></i>
                                    <h4 className="service-title">{service.title}</h4>
                                    <p className="service-description">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}