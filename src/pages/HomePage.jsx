import React from 'react';
import Navbar from '../Components/Layout/Navbar';
import './HomePage.css'; // We'll create this new CSS file for styling

const HomePage = () => {
  return (
    <div className="homepage-container">
      <Navbar user={null} />

      {/* --- Hero Section --- */}
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-heading">The Future of <span className="carbon-accounting-highlight">Carbon Accounting</span> </h1>
          <p className="hero-subheading">
            Track, analyze, and report your mine's carbon footprint with unparalleled precision and strategic insight.
          </p>
          <button className="hero-cta-button">Get Started for Free</button>
        </div>
        <div className="hero-glow-orb"></div>
      </header>

      {/* --- Features Section with Futuristic Cards --- */}
      <section className="features-section">
        <h2 className="section-title">An All-in-One Decarbonization Platform</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="card-icon">📊</div>
            <h3>GHG Inventory Explorer</h3>
            <p>Log and track every emission source—from fuel to fugitives—with an intuitive data entry system that validates as you go.</p>
          </div>
          <div className="feature-card">
            <div className="card-icon">🚀</div>
            <h3>Simulation Dashboard</h3>
            <p>Model future scenarios. Compare the financial and environmental impact of strategic decisions like fleet electrification before you commit.</p>
          </div>
          <div className="feature-card">
            <div className="card-icon">🌳</div>
            <h3>Sequestration Manager</h3>
            <p>Manage and quantify your carbon sink projects. Track afforestation and reclamation efforts with integrated mapping and species data.</p>
          </div>
        </div>
      </section>

      {/* --- Interactive "How It Works" Section --- */}
      <section className="how-it-works-section">
        <h2 className="section-title">From Data to Decision in 3 Steps</h2>
        <div className="steps-container">
            <div className="step-item">
                <div className="step-number">1</div>
                <h4>Input & Validate</h4>
                <p>Easily upload or enter your operational data. Our system automatically validates entries to ensure accuracy from the start.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
                <div className="step-number">2</div>
                <h4>Analyze & Visualize</h4>
                <p>Instantly see your carbon footprint on the dashboard. Analyze trends, identify hotspots, and model future scenarios.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
                <div className="step-number">3</div>
                <h4>Report & Comply</h4>
                <p>Generate auditor-ready reports with a single click. Export your data in PDF or CSV for internal reviews or compliance.</p>
            </div>
        </div>
      </section>


      {/* --- Testimonials Section --- */}
      <section className="testimonials-section">
        <h2 className="section-title">Trusted by Industry Leaders</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="quote">"This platform transformed our sustainability reporting. What used to take weeks now takes hours. The simulation dashboard is a game-changer for our strategic planning."</p>
            <div className="author">
              <span className="author-name">Anjali Sharma</span>
              <span className="author-title">Head of Sustainability, GeoMin Resources</span>
            </div>
          </div>
          <div className="testimonial-card">
            <p className="quote">"The accuracy and granularity are unmatched. We finally have a reliable, single source of truth for our emissions data across all of our sites."</p>
            <div className="author">
              <span className="author-name">David Chen</span>
              <span className="author-title">Chief Operations Officer, Coal India Corp</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- Final CTA Section --- */}
      <section className="final-cta-section">
          <h2>Ready to Take Control of Your Carbon Footprint?</h2>
          <p>Join the leading mines in building a sustainable and profitable future.</p>
          <button className="hero-cta-button">Request a Demo</button>
      </section>

      {/* --- Footer --- */}
      <footer className="footer">
        <p>© 2025 Decarbonize. All Rights Reserved.</p>
        <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;