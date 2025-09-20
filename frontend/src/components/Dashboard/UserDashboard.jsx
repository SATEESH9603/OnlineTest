import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

export default function UserDashboard({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // Initials: Firstname first letter + Lastname last letter
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.slice(-1) || ''}`.toUpperCase();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
        <div ref={dropdownRef} className="fixed-avatar-container" onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}>
          <div
            className="user-avatar"
            title={`${user?.firstName} ${user?.lastName}`}
          >
            {user?.profileImage ? (
              <img src={user.profileImage} alt="User Avatar" className="avatar-img" />
            ) : (
              initials
            )}
          </div>
          {open && (
            <div className="user-dropdown">
              <div
                className="user-dropdown-option"
                onClick={() => navigate('/profile')}
              >
                Profile View
              </div>
              <div
                className="user-dropdown-option logout"
                onClick={onLogout}
              >
                Logout
              </div>
            </div>
          )}
        </div>

      <div className="user-dashboard-content">
        <h2>Welcome, {user?.firstName || 'User'}!</h2>
        <p>This is your dashboard.</p>
      </div>
    </div>
  );
}