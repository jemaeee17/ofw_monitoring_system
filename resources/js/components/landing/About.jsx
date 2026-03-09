import React from 'react';
import '../../../css/landingpage/about.css';

export default function About() {
    return (
        <section id="about" className="aboutus-section py-5 pb-5">
            <div className="container d-flex flex-wrap align-items-stretch">

                <div className="aboutus-images col-lg-6 position-relative mb-4 mb-lg-0">
                    <img
                        src="/images/about/about-img-1.jpg"
                        alt="About Large"
                        className="large-img"
                    />
                    <img
                        src="/images/about/about-img-2.jpg"
                        alt="About Small"
                        className="small-img"
                    />
                </div>

                <div className="aboutus-text col-lg-6">
                    <div className='aboutus-text-border'>
                        <p className="short-text text-primary mb-2">Our Story</p>
                        <h2 className="aboutus-heading">
                            Together, We Build Success
                        </h2>
                    </div>
                    <p className="aboutus-description">
                        <strong>JOSELINE INTERNATIONAL Manpower Corporation</strong> has been a trusted leader in workforce solutions, dedicated to connecting skilled talent with businesses that need them. We provide comprehensive manpower services tailored to meet the unique demands of each client, ensuring both quality and efficiency. Our mission is to empower workers by offering meaningful employment opportunities while helping companies grow sustainably and achieve their operational goals. With years of experience, a commitment to excellence, and a focus on ethical practices, <strong>JOSELINE INTERNATIONAL Manpower Corporation</strong> continues to build bridges between people and opportunities, creating a lasting impact on communities and industries alike.
                    </p>

                    <div className="aboutus-features mt-4">
                        <div className="row g-3 text-center">
                            <div className="col-md-4">
                                <div className="feature-item">
                                    <i className="bi bi-people-fill feature-icon"></i>
                                    <h6 className="feature-title">Trusted Workforce Solutions</h6>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="feature-item">
                                    <i className="bi bi-briefcase-fill feature-icon"></i>
                                    <h6 className="feature-title">Tailored Manpower Services</h6>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="feature-item">
                                    <i className="bi bi-graph-up-arrow feature-icon"></i>
                                    <h6 className="feature-title">Empowering Growth & Opportunities</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}