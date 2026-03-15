import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Step2Schedule = ({ formData, setFormData, phBlue }) => {
    const [fullyBookedDates, setFullyBookedDates] = useState([]);
    const [bookedTimes, setBookedTimes] = useState([]);
    const [loadingTimes, setLoadingTimes] = useState(false);

    const allTimes = [
        "08:00 AM - 09:00 AM",
        "09:00 AM - 10:00 AM",
        "10:00 AM - 11:00 AM",
        "11:00 AM - 12:00 PM",
        "01:00 PM - 02:00 PM",
        "02:00 PM - 03:00 PM",
        "03:00 PM - 04:00 PM",
        "04:00 PM - 05:00 PM",
    ];

    const isSunday = (date) => date.getDay() === 0;

    useEffect(() => {
        if (!formData.agency_id) return;

        axios
            .get("/api/appointments/fully-booked", {
                params: { agency_id: formData.agency_id },
            })
            .then((res) => {
                const dates = res.data.map((item) => new Date(item.schedule_date));
                setFullyBookedDates(dates);
            })
            .catch((err) => console.error(err));
    }, [formData.agency_id]);

    const fetchBookedTimes = (date) => {
        if (!formData.agency_id || !date) return;
        setLoadingTimes(true);

        axios
            .get(`/api/appointments/booked-times/${date}`, {
                params: { agency_id: formData.agency_id },
            })
            .then((res) => {
                setBookedTimes(res.data);
                setLoadingTimes(false);
            })
            .catch((err) => {
                console.error(err);
                setLoadingTimes(false);
            });
    };

    const handleDateChange = (date) => {
        const formattedDate = date.toISOString().split("T")[0];

        setFormData({
            ...formData,
            schedule_date: formattedDate,
            schedule_time: "", 
        });

        fetchBookedTimes(formattedDate);
    };

    const availableTimes = allTimes.filter((time) => !bookedTimes.includes(time));

    return (
        <div className="animate-fade-in">
            <div className="col-12 mb-4">
                <h5 className="fw-bold" style={{ color: phBlue }}>
                    Step 2: Choose Available Schedule
                </h5>
                <p className="text-muted">
                    Select your preferred appointment date and time.
                </p>
            </div>

            <div className="row g-4">
                {/* LEFT: Calendar */}
                <div className="col-md-4">
                    <label className="fw-bold mb-2">Preferred Appointment Date</label>
                    <div className="shadow-sm p-3 border rounded bg-white">
                        <DatePicker
                            selected={formData.schedule_date ? new Date(formData.schedule_date) : null}
                            onChange={handleDateChange}
                            inline
                            minDate={new Date()}
                            filterDate={(date) => !isSunday(date)}
                            excludeDates={fullyBookedDates}
                        />
                        <small className="text-muted d-block mt-2">
                            Sundays are not available for appointments.
                        </small>
                    </div>
                </div>

                {/* MIDDLE: Time Selection */}
                <div className="col-md-4">
                    <label className="fw-bold mb-2">Preferred Time</label>
                    <div className="p-3 border rounded shadow-sm bg-white">
                        {!formData.schedule_date && <small className="text-muted">Select a date first.</small>}

                        {formData.schedule_date && loadingTimes && <small>Loading available times...</small>}

                        {formData.schedule_date && !loadingTimes && (
                            availableTimes.length > 0 ? (
                                availableTimes.map((time) => (
                                    <div key={time} className="form-check mb-2">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="schedule_time"
                                            value={time}
                                            checked={formData.schedule_time === time}
                                            onChange={() => setFormData({ ...formData, schedule_time: time })}
                                        />
                                        <label className="form-check-label">{time}</label>
                                    </div>
                                ))
                            ) : (
                                <div className="text-danger small">
                                    No available time slots for this date.
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* RIGHT: Fully Booked Dates */}
                <div className="col-md-4">
                    <h6 className="fw-bold text-danger mb-3">Fully Booked Dates</h6>
                    <div className="p-3 border rounded shadow-sm bg-white">
                        {fullyBookedDates.length === 0 ? (
                            <div className="text-muted small">No fully booked dates.</div>
                        ) : (
                            fullyBookedDates.map((date, idx) => (
                                <div key={idx} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                                    <span className="small">{date.toDateString()}</span>
                                    <span className="badge bg-danger">Full</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step2Schedule;