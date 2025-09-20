import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../services/api';
import './ResetPassword.css';

export default function ResetPassword() {
 const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const [finalToken, setFinalToken] = useState(null);
  const [tokenType, setTokenType] = useState('JWT');

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  // ------------------- Token detection -------------------
  
  useEffect(() => {
    // ------------------- TOKEN DETECTION -------------------
    // 1️⃣ Token from navigation state (logged-in user)
    const tokenFromState = location.state?.token;

    // 2️⃣ Token from URL path param (e.g., /reset-password/:token)
    const tokenFromPath = params.token;

    // 3️⃣ Token from query param (email link)
    const queryParams = new URLSearchParams(window.location.search);
    const tokenFromQuery = queryParams.get('token') || queryParams.get('resetToken');

    // 4️⃣ Select token in priority: state > path param > query param
    const token = tokenFromState || tokenFromPath || tokenFromQuery;

    if (!token) {
      setTimeout(() => {
        alert('No valid token found. Please login or use the reset link.');
        navigate('/login');
      }, 100);
      return;
    }

    // 5️⃣ Determine token type for API
    const type = tokenFromState ? 'JWT' : 'EMAIL';

    setFinalToken(token);
    setTokenType(type);
    setCheckingToken(false);
  }, [location.state, params.token, navigate]);

  // ------------------- FORM SUBMIT -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      return alert('Both password fields are required.');
    }

    if (newPassword !== confirmPassword) {
      return alert('Passwords do not match.');
    }

    if (!finalToken) {
      return alert('No valid token found.');
    }

    setLoading(true);
    try {
      const res = await resetPassword(finalToken, { newPassword, confirmPassword }, tokenType);

      if (res.success) {
        alert(res.message || 'Password reset successful.');
        navigate('/login');
      } else {
        alert('Error: ' + (res.error?.message || 'Unable to reset password.'));
      }
    } catch (err) {
      const backendError =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Error resetting password';
      alert('Error: ' + backendError);
    } finally {
      setLoading(false);
    }
  };
  // ------------------- Render -------------------
  if (checkingToken) {
    return (
      <div className="reset-container">
        <p>Checking token...</p>
      </div>
    );
  }

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
