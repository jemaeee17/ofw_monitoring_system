import React, { useState } from 'react';
import '../../../css/landingpage/featured.css';

const jobData = [
    {
        id: 1,
        title: 'Warehouse Supervisor',
        location: 'Saudi Arabia',
        image: '/images/featured/featured-img-1.jpg',
        description: 'Oversee daily warehouse operations and manage staff.'
    },
    {
        id: 2,
        title: 'Construction Laborer',
        location: 'Greece',
        image: '/images/featured/featured-img-2.jpg',
        description: 'Assist in construction tasks and maintain safety.'
    },
    {
        id: 3,
        title: 'Office Administrator',
        location: 'Saudi Arabia',
        image: '/images/featured/featured-img-3.jpg',
        description: 'Manage office operations and administrative tasks.'
    },
    {
        id: 4,
        title: 'Driver',
        location: 'Greece',
        image: '/images/featured/featured-img-4.jpg',
        description: 'Transport materials safely to designated locations.'
    },
    {
        id: 5,
        title: 'IT Support Specialist',
        location: 'Saudi Arabia',
        image: '/images/featured/featured-img-5.jpg',
        description: 'Provide technical support and maintain systems.'
    },
    {
        id: 6,
        title: 'Housekeeping Staff',
        location: 'Greece',
        image: '/images/featured/featured-img-6.jpg',
        description: 'Maintain cleanliness and order in assigned areas.'
    },
    {
        id: 7,
        title: 'Receptionist',
        location: 'Saudi Arabia',
        image: '/images/featured/featured-img-7.jpg',
        description: 'Handle inquiries and front desk operations.'
    },
    {
        id: 8,
        title: 'Electrician',
        location: 'Greece',
        image: '/images/featured/featured-img-8.jpg',
        description: 'Install and maintain electrical systems.'
    }
];

export default function Featured() {
    const [search, setSearch] = useState('');
    const [country, setCountry] = useState('');

    const filteredJobs = jobData.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) &&
        (country === '' || job.location === country)
    );

    return (
        <section id="featured" className="featured-section">
            <div className="container">

                <div className="row align-items-center mb-4">
                    <div className="col-md-6 text-center text-md-start">
                        <h2 className="featured-heading">Featured Jobs</h2>
                        <p className="featured-subtitle">Browse latest opportunities</p>
                    </div>

                    <div className="col-md-6 d-flex justify-content-center justify-content-md-end mt-3 mt-md-0 gap-2">
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            className="form-control featured-search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select
                            className="form-select featured-dropdown"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        >
                            <option value="">All Countries</option>
                            <option value="Saudi Arabia">Saudi Arabia</option>
                            <option value="Greece">Greece</option>
                        </select>
                    </div>
                </div>

                <div className="row mt-4 g-4">
                    {filteredJobs.map(job => (
                        <div key={job.id} className="col-lg-3 col-md-6">
                            <div className="job-card">
                                <div className="job-image">
                                    <img src={job.image} alt={job.title} className="img-fluid" />
                                </div>
                                <div className="job-content p-3">
                                    <h5 className="job-title">{job.title}</h5>
                                    <p className="job-location">{job.location}</p>
                                    <p className="job-description">{job.description}</p>
                                    <button className="btn btn-primary w-100 mt-2 rounded-pill">Apply Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}