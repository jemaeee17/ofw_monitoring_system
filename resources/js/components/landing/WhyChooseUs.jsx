import React from "react";
import "../../../css/landingpage/whychooseus.css";

export default function WhyChooseUs() {
    return (
        <section id="why" className="whychoose-section">
            <div className="container">
                <div className="row align-items-center">

                    <div className="col-lg-6 position-relative whychoose-image-wrapper">
                        <img
                            src="/images/whychooseus/whychooseus-img.jpg"
                            alt="Why Choose Us"
                            className="whychoose-image"
                        />
                    </div>

                    <div className="col-lg-6 text-white whychoose-content">
                        <div className="whychoose-title-wrap">
                            <span className="whychoose-line"></span>
                            <p className="whychoose-subtitle">Why Choose Us</p>
                        </div>

                        <h2 className="whychoose-heading">
                            Trusted Manpower Solutions You Can Rely On
                        </h2>

                        <p className="whychoose-description">
                            We are committed to connecting skilled professionals with
                            reputable employers worldwide. Our agency focuses on
                            quality recruitment, ethical practices, and long-term
                            career growth for job seekers while helping businesses
                            find dependable talent efficiently.
                        </p>

                        <ul className="whychoose-list">
                            <li>Reliable and Verified Job Opportunities</li>
                            <li>Professional Recruitment Support</li>
                            <li>Fast and Efficient Hiring Process</li>
                            <li>Global Workforce Placement Expertise</li>
                        </ul>
                    </div>

                </div>
            </div>
        </section>
    );
}