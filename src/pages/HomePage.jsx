import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Layout/Navbar';
import './HomePage.css'; // We'll create this new CSS file for styling

const HomePage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="homepage-container">
      {/* Animated Background Elements */}
      <div className="background-elements">
        <div className="floating-particles"></div>
        <div className="neural-network"></div>
        <div 
          className="cursor-glow"
          style={{
            left: mousePosition.x - 200,
            top: mousePosition.y - 200,
          }}
        ></div>
      </div>

      <Navbar user={null} />

      {/* --- Enhanced Hero Section --- */}
      <header className="hero-section">
        <div className="hero-background">
          <div className="hero-orb-1"></div>
          <div className="hero-orb-2"></div>
          <div className="hero-orb-3"></div>
          <div className="hero-grid"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🌍</span>
            <span>Next-Generation Carbon Management</span>
          </div>
          <h1 className="hero-heading">
            The Future of 
            <span className="carbon-accounting-highlight">
              <span className="highlight-text">Carbon Intelligence</span>
              <div className="highlight-glow"></div>
            </span>
          </h1>
          <p className="hero-subheading">
            Harness AI-powered analytics to transform your industrial operations into a 
            sustainable, profitable, and future-ready enterprise.
          </p>
          <div className="hero-cta-group">
            <button
              className="hero-cta-button primary"
              onClick={() => navigate('/login')}
            >
              <span>Start Your Journey</span>
              <div className="button-glow"></div>
            </button>
            <button className="hero-cta-button secondary">
              <span>🎥 Watch Demo</span>
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">99.5%</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50M+</div>
              <div className="stat-label">Data Points</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">85%</div>
              <div className="stat-label">Time Saved</div>
            </div>
          </div>
        </div>
        <div 
          className="hero-3d-element"
          style={{
            transform: `translateY(${scrollY * 0.5}px) rotateX(${scrollY * 0.1}deg)`
          }}
        >
          <div className="floating-dashboard">
            <div className="dashboard-header">
              <div className="dashboard-dots">
                <span></span><span></span><span></span>
              </div>
              <span>Carbon Analytics</span>
            </div>
            <div className="dashboard-content">
              <div className="dashboard-chart">
                <div className="chart-bar" style={{height: '60%'}}></div>
                <div className="chart-bar" style={{height: '40%'}}></div>
                <div className="chart-bar" style={{height: '80%'}}></div>
                <div className="chart-bar" style={{height: '30%'}}></div>
                <div className="chart-bar" style={{height: '70%'}}></div>
              </div>
              <div className="dashboard-metrics">
                <div className="metric">
                  <span className="metric-value">2,847</span>
                  <span className="metric-label">tCO₂e</span>
                </div>
                <div className="metric">
                  <span className="metric-value">-12%</span>
                  <span className="metric-label">vs Last Month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Features Section with Component Mockups --- */}
      <section id="features-section" className="features-section">
        <div className="section-badge">
          <span>Modular System</span>
        </div>
        <h2 className="section-title">Next-Generation Carbon Management Platform</h2>
        <p className="section-subtitle">Our AI-driven solution provides a comprehensive suite of tools to measure, analyze, and reduce your carbon footprint.</p>
        
        <div className="features-grid">
          <div 
            className="feature-card 3d-card"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width - 0.5;
              const y = (e.clientY - rect.top) / rect.height - 0.5;
              e.currentTarget.style.transform = `perspective(1000px) rotateX(${y * 5}deg) rotateY(${x * -5}deg) scale3d(1.02, 1.02, 1.02)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            }}
          >
            <div className="card-content">
              <div className="card-badge">Core Module</div>
              <div className="card-icon-container">
                <div className="card-icon">📊</div>
              </div>
              <h3>GHG Inventory Explorer</h3>
              <p>Log and track every emission source—from fuel to fugitives—with an intuitive data entry system that validates as you go.</p>
              <ul className="feature-list">
                <li>Multi-category data collection</li>
                <li>Real-time validation</li>
                <li>Automated emission calculations</li>
                <li>Interactive data visualizations</li>
              </ul>
            </div>
            <div className="card-mockup ghg-mockup">
              <div className="mockup-header">
                <div className="mockup-tabs">
                  <div className="mockup-tab active">Fuel</div>
                  <div className="mockup-tab">Electricity</div>
                  <div className="mockup-tab">Fugitive</div>
                </div>
              </div>
              <div className="mockup-content">
                <div className="mockup-chart">
                  <div className="mockup-bar" style={{height: '65%'}}></div>
                  <div className="mockup-bar" style={{height: '85%'}}></div>
                  <div className="mockup-bar" style={{height: '45%'}}></div>
                  <div className="mockup-bar" style={{height: '75%'}}></div>
                </div>
                <div className="mockup-form">
                  <div className="mockup-input"></div>
                  <div className="mockup-input"></div>
                  <div className="mockup-button"></div>
                </div>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>

          <div 
            className="feature-card 3d-card"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width - 0.5;
              const y = (e.clientY - rect.top) / rect.height - 0.5;
              e.currentTarget.style.transform = `perspective(1000px) rotateX(${y * 5}deg) rotateY(${x * -5}deg) scale3d(1.02, 1.02, 1.02)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            }}
          >
            <div className="card-content">
              <div className="card-badge">Strategic Planning</div>
              <div className="card-icon-container">
                <div className="card-icon">🚀</div>
              </div>
              <h3>Simulation Dashboard</h3>
              <p>Model future scenarios. Compare the financial and environmental impact of strategic decisions before you commit.</p>
              <ul className="feature-list">
                <li>Interactive scenario modeling</li>
                <li>Financial impact projections</li>
                <li>Comparative analysis</li>
                <li>Risk assessment tools</li>
              </ul>
            </div>
            <div className="card-mockup simulation-mockup">
              <div className="mockup-header">
                <div className="mockup-title">Scenario Comparison</div>
              </div>
              <div className="mockup-content">
                <div className="mockup-scenario">
                  <div className="scenario-header">Baseline</div>
                  <div className="scenario-line"></div>
                </div>
                <div className="mockup-scenario active">
                  <div className="scenario-header">Electrification</div>
                  <div className="scenario-line"></div>
                </div>
                <div className="mockup-metrics">
                  <div className="mockup-metric">
                    <div className="metric-value">$2.4M</div>
                    <div className="metric-label">Savings</div>
                  </div>
                  <div className="mockup-metric">
                    <div className="metric-value">-42%</div>
                    <div className="metric-label">Emissions</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>

          <div 
            className="feature-card 3d-card"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width - 0.5;
              const y = (e.clientY - rect.top) / rect.height - 0.5;
              e.currentTarget.style.transform = `perspective(1000px) rotateX(${y * 5}deg) rotateY(${x * -5}deg) scale3d(1.02, 1.02, 1.02)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            }}
          >
            <div className="card-content">
              <div className="card-badge">Carbon Offsetting</div>
              <div className="card-icon-container">
                <div className="card-icon">🌳</div>
              </div>
              <h3>Sequestration Manager</h3>
              <p>Manage and quantify your carbon sink projects. Track afforestation and reclamation efforts with integrated analytics.</p>
              <ul className="feature-list">
                <li>Project portfolio management</li>
                <li>Carbon credit tracking</li>
                <li>Geospatial visualization</li>
                <li>Progress monitoring dashboards</li>
              </ul>
            </div>
            <div className="card-mockup sequestration-mockup">
              <div className="mockup-header">
                <div className="mockup-title">Project Overview</div>
              </div>
              <div className="mockup-content">
                <div className="mockup-map"></div>
                <div className="mockup-projects">
                  <div className="mockup-project active">
                    <div className="project-dot"></div>
                    <div className="project-bar"></div>
                  </div>
                  <div className="mockup-project">
                    <div className="project-dot"></div>
                    <div className="project-bar"></div>
                  </div>
                  <div className="mockup-project">
                    <div className="project-dot"></div>
                    <div className="project-bar"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>
          
          <div 
            className="feature-card 3d-card"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width - 0.5;
              const y = (e.clientY - rect.top) / rect.height - 0.5;
              e.currentTarget.style.transform = `perspective(1000px) rotateX(${y * 5}deg) rotateY(${x * -5}deg) scale3d(1.02, 1.02, 1.02)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            }}
          >
            <div className="card-content">
              <div className="card-badge">Compliance & Reporting</div>
              <div className="card-icon-container">
                <div className="card-icon">📑</div>
              </div>
              <h3>Report Generation</h3>
              <p>Create comprehensive reports for internal review, stakeholder presentations, and regulatory compliance.</p>
              <ul className="feature-list">
                <li>Multiple template options</li>
                <li>Custom time periods and filters</li>
                <li>Multi-format exports (PDF, Excel, CSV)</li>
                <li>Audit-ready documentation</li>
              </ul>
            </div>
            <div className="card-mockup report-mockup">
              <div className="mockup-header">
                <div className="mockup-title">Report Builder</div>
              </div>
              <div className="mockup-content">
                <div className="mockup-report">
                  <div className="mockup-section"></div>
                  <div className="mockup-section"></div>
                  <div className="mockup-section"></div>
                </div>
                <div className="mockup-controls">
                  <div className="mockup-option"></div>
                  <div className="mockup-option"></div>
                  <div className="mockup-button"></div>
                </div>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>
        </div>
        
        <div className="features-cta">
          <button className="feature-cta-button">
            <span>Explore All Features</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4.16669 10H15.8334" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 4.16669L15.8333 10L10 15.8334" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      {/* --- Interactive "How It Works" Section --- */}
      <section id="solution-section" className="how-it-works-section">
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