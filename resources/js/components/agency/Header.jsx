import React, { useEffect, useState } from "react";

const Header = ({ activePage }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    if (!user) return null;

    const initials = `${user.name?.charAt(0) ?? ''}${user.lastname?.charAt(0) ?? ''}`;

    return (
        <header className="header-ph px-4 border-bottom bg-white d-flex justify-content-between align-items-center">
            <h5 className="m-0 fw-bold text-dark">{activePage}</h5>
            <div className="user-profile-ph d-flex align-items-center gap-3">
                <div className="user-text text-end d-none d-md-block">
                    <p className="m-0 fw-bold small">{user.name} {user.lastname}</p>
                    <small className="text-success" style={{ fontSize: '10px' }}>
                        ● {user.role === 'admin' ? 'Super Admin' : 'Agency'}
                    </small>
                </div>
                <div className="avatar-ph">{initials}</div>
            </div>
        </header>
    );
};

export default Header;