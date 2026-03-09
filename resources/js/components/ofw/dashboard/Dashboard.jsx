import React from "react";

export default function Dashboard() {
    const sliderHeight = "300px"; 

    return (
        <>
            <h4 className="fw-bold mb-4">Dashboard Overview</h4>
            <p className="text-muted">Welcome to your OFW dashboard.</p>

            <div
                id="dashboardCarousel"
                className="carousel slide"
                data-bs-ride="carousel"
                style={{ maxWidth: "1000px", margin: "0 auto", objectFit: "cover"}} 
            >
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#dashboardCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#dashboardCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#dashboardCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>

                <div className="carousel-inner" style={{ height: sliderHeight }}>
                    <div className="carousel-item active">
                        <img
                            src="/images/ofw-images/ofw-images-1.jpeg"
                            className="d-block w-100"
                            alt="Slide 1"
                            style={{ height: sliderHeight, objectFit: "cover", borderRadius: "8px" }}
                        />
                    </div>
                    <div className="carousel-item">
                        <img
                            src="/images/ofw-images/ofw-images-2.jpeg"
                            className="d-block w-100"
                            alt="Slide 2"
                            style={{ height: sliderHeight, objectFit: "cover", borderRadius: "8px" }}
                        />
                    </div>
                    <div className="carousel-item">
                        <img
                            src="/images/ofw-images/ofw-images-3.jpeg"
                            className="d-block w-100"
                            alt="Slide 3"
                            style={{ height: sliderHeight, objectFit: "cover", borderRadius: "8px" }}
                        />
                    </div>
                </div>

                <button className="carousel-control-prev" type="button" data-bs-target="#dashboardCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#dashboardCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </>
    );
}