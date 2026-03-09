import React from 'react';
import '../../../css/landingpage/contact.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

export default function Contact() {
    return (
        <section id="contact" className="contact-section">
            <div className="container">

                <div className="row align-items-start">

                    <div className="col-lg-6 contact-left">
                        <p className="contact-subtitle">Contact Us</p>

                        <h2 className="contact-heading">Get In Touch</h2>

                        <p className="contact-description">
                            We are committed to providing reliable manpower solutions and assisting
                            both employers and job seekers. Reach out to us for inquiries,
                            recruitment assistance, or partnership opportunities. Our team is ready
                            to support you every step of the way.
                        </p>

                        <div className="contact-info">
                            <div className="contact-item">
                                <FaMapMarkerAlt className="contact-icon" />
                                <span>4334 Gen. Tinio, Brgy. Bangkal, Makati City</span>
                            </div>

                            <div className="contact-item">
                                <FaPhoneAlt className="contact-icon" />
                                <span>+63 912 345 6789</span>
                            </div>

                            <div className="contact-item">
                                <FaEnvelope className="contact-icon" />
                                <span>info@joselineagency.com</span>
                            </div>

                            <div className="contact-item">
                                <FaMapMarkerAlt className="contact-icon" />
                                <span>Mon - Fri: 8:00 AM - 5:00 PM</span>
                            </div>
                        </div>

                        <div className="contact-social">
                            <a href="#" className="social-icon"><FaFacebookF /></a>
                            <a href="#" className="social-icon"><FaLinkedinIn /></a>
                            <a href="#" className="social-icon"><FaInstagram /></a>
                        </div>
                    </div>

                    <div className="col-lg-6 contact-right">
                        <div className="contact-form-card">
                            <h4 className="form-title">Send Us a Message</h4>

                            <form>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control contact-input"
                                        placeholder="Full Name"
                                    />
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="form-control contact-input"
                                        placeholder="Email Address"
                                    />
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control contact-input"
                                        placeholder="Subject"
                                    />
                                </div>

                                <div className="mb-3">
                                    <textarea
                                        className="form-control contact-textarea"
                                        rows="5"
                                        placeholder="Your Message"
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn contact-btn w-100">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="map-fullwidth">
                <iframe
                    src="https://www.google.com/maps?q=4334+Gen.+Tinio+Brgy+Bangkál,+Makati+City&output=embed"
                    width="100%"
                    height="450"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>
        </section>
    );
}