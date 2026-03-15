import React, { useEffect, useState } from "react";

const Header = ({ activePage }) => {
    const [agency, setAgency] = useState(null);

    useEffect(() => {
        const storedAgency = localStorage.getItem('agency_user'); 
        if (storedAgency) {
            setAgency(JSON.parse(storedAgency));
        }
    }, []);

    if (!agency) return null;

    const initials = `${agency.name?.charAt(0) ?? ''}${agency.lastname?.charAt(0) ?? ''}`;

    return (
        <header className="header-ph px-4 border-bottom bg-white d-flex justify-content-between align-items-center">
            <h5 className="m-0 fw-bold text-dark">{activePage}</h5>
            <div className="user-profile-ph d-flex align-items-center gap-3">
                <div className="user-text text-end d-none d-md-block">
                    <p className="m-0 fw-bold small">{agency.name} {agency.lastname ?? ''}</p>
                    <small className="text-success" style={{ fontSize: '10px' }}>
                        ● Agency
                    </small>
                </div>
                <div className="avatar-ph">{initials}</div>
            </div>
        </header>
    );
};

export default Header;