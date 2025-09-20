import React, { useState } from 'react';
import { forgotPassword } from '../../services/api';
import { useNavigate } from 'react-router-dom';
//import { toast } from 'react-toastify';
import './ForgotPassword.css';

export default function ForgotPassword() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await forgotPassword({ username, email });
            if (res.success) {
                //toast.success(res.message || "Password reset request processed.");
                alert(res.message || "Password reset request processed.");
                navigate('/login');
            } else {
                //toast.error(res.error?.message || "Unable to process request.");
                alert('Error: ', res.error?.message || "Unable to process request.");
            }
        } catch (err) {
            const backendError =
                err.response?.data?.error?.message ||
                err.response?.data?.message ||
                "Error sending password reset link";
            //toast.error(backendError);
            alert('Error: ', backendError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-container">
            <div className="forgot-card">
                <h2>Forgot Password</h2>
                <p>Enter your username and/or email to receive a password reset link.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email (optional)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
            </div>
        </div>
    );
}
