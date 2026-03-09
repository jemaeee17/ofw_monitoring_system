import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import '../../../css/landingpage/footer.css';

export default function Footer() {
    return (
        <footer className="footer-section bg-dark text-white">
            <div className="container">
                <div className="row">

                    <div className="col-lg-4 mb-4 mb-lg-0">
                        <div className="footer-logo d-flex align-items-center mb-3">
                            <img src="/images/agency_logo.png" alt="Agency Logo" width="50" height="50" className="me-2 rounded-circle" />
                            <h5 className="mb-0">JOSELINE INTERNATIONAL</h5>
                        </div>
                        <p className="footer-text">
                            Connecting talent with opportunity and providing trusted manpower solutions worldwide.
                        </p>
                        <div className="footer-social mt-3 d-flex align-items-center">
                            <a href="#" className="social-icon me-2"><FaFacebookF /></a>
                            <a href="#" className="social-icon me-2"><FaTwitter /></a>
                            <a href="#" className="social-icon me-2"><FaInstagram /></a>
                            <a href="#" className="social-icon"><FaLinkedinIn /></a>
                        </div>
                    </div>

                    <div className="col-lg-4 mb-4 mb-lg-0">
                        <h5 className="footer-heading mb-3">Quick Links</h5>
                        <ul className="footer-links list-unstyled">
                            <li><a href="#home">Home</a></li>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#services">Services</a></li>
                            <li><a href="#jobs">Featured Jobs</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>

                    <div className="col-lg-4">
                        <h5 className="footer-heading mb-3">Contact Info</h5>
                        <ul className="footer-contact list-unstyled">
                            <li><strong>Phone:</strong> +63 912 345 6789</li>
                            <li><strong>Email:</strong> info@joseline.com</li>
                            <li><strong>Address:</strong> 4334 Gen. Tinio, Brgy. Bangkal, Makati City</li>
                            <li><strong>Opening Hours:</strong> Mon - Fri, 9:00 AM - 6:00 PM</li>
                        </ul>
                    </div>
                </div>

                <hr className="footer-divider my-4" />

                <p className="text-center mb-0">
                    &copy; {new Date().getFullYear()} JOSELINE INTERNATIONAL Manpower Corporation. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}