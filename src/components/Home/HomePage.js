import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage({ user }) {
  return (
    <div className="homepage">
      {/* Top-right nav buttons */}
      {!user && (
        <div className="homepage-nav">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/register" className="signup-btn">Sign Up</Link>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Sharpen Your Knowledge with Fun Quizzes</h2>
          <p>
            QuizMaster helps you learn, compete, and grow with interactive quizzes across multiple topics.
          </p>
          <Link 
            to={user ? "/dashboard" : "/register"} 
            className="cta-btn"
          >
            {user ? "Go to Dashboard" : "Get Started"}
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <h3>📚 Learn Smarter</h3>
          <p>Engaging quizzes that boost memory and knowledge retention.</p>
        </div>
        <div className="feature-card">
          <h3>⚡ Quick & Fun</h3>
          <p>Short quizzes you can play anytime, anywhere.</p>
        </div>
        <div className="feature-card">
          <h3>🌎 Compete Globally</h3>
          <p>Challenge friends or learners worldwide and track your progress.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <p>© {new Date().getFullYear()} QuizMaster. All rights reserved.</p>
      </footer>
    </div>
  );
}
