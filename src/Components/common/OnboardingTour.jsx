import React, { useState, useEffect } from 'react';
import './OnboardingTour.css';

/**
 * OnboardingTour Component
 * Lightweight 3-step guided tour for new users
 */
const OnboardingTour = ({ onComplete, userEmail }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen tour
    const hasSeenTour = localStorage.getItem(`tour_completed_${userEmail}`);
    if (!hasSeenTour) {
      // Show tour after a brief delay
      setTimeout(() => setIsVisible(true), 500);
    }
  }, [userEmail]);

  const steps = [
    {
      id: 1,
      title: "Welcome to Decarbonize! 🎉",
      description: "Let's get you started with a quick 3-step tour to help you track and reduce your carbon emissions.",
      icon: "👋",
      highlight: null
    },
    {
      id: 2,
      title: "Step 1: Connect Your Data",
      description: "Start by uploading your emissions data or manually entering fuel consumption, electricity usage, and other sources.",
      icon: "📊",
      cta: "Go to GHG Inventory",
      ctaLink: "/dashboard/inventory",
      highlight: "sidebar-inventory"
    },
    {
      id: 3,
      title: "Step 2: Review Your Baseline",
      description: "View your carbon footprint on the dashboard. The KPI cards show your total emissions, trends, and intensity metrics.",
      icon: "📈",
      cta: "View Dashboard",
      ctaLink: "/dashboard",
      highlight: "kpi-cards"
    },
    {
      id: 4,
      title: "Step 3: Generate Your First Report",
      description: "Create professional emissions reports for stakeholders, auditors, or compliance purposes with just a few clicks.",
      icon: "📄",
      cta: "Generate Report",
      ctaLink: "/dashboard/reports",
      highlight: "sidebar-reports"
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem(`tour_completed_${userEmail}`, 'true');
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="onboarding-backdrop" onClick={handleSkip} />

      {/* Tour Modal */}
      <div className="onboarding-modal" role="dialog" aria-labelledby="tour-title" aria-modal="true">
        {/* Progress Bar */}
        <div className="tour-progress-bar">
          <div className="tour-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Close Button */}
        <button 
          className="tour-close-btn" 
          onClick={handleSkip}
          aria-label="Close tour"
        >
          ✕
        </button>

        {/* Content */}
        <div className="tour-content">
          <div className="tour-icon">{currentStepData.icon}</div>
          <h2 id="tour-title" className="tour-title">{currentStepData.title}</h2>
          <p className="tour-description">{currentStepData.description}</p>

          {/* Step Indicators */}
          <div className="tour-indicators">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`tour-indicator ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                aria-label={`Step ${index + 1}`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="tour-actions">
          <button 
            className="tour-btn secondary" 
            onClick={handleSkip}
          >
            Skip Tour
          </button>
          
          <div className="tour-nav-buttons">
            {currentStep > 0 && (
              <button 
                className="tour-btn ghost" 
                onClick={handlePrev}
              >
                ← Previous
              </button>
            )}
            <button 
              className="tour-btn primary" 
              onClick={handleNext}
            >
              {currentStep === steps.length - 1 ? 'Get Started 🚀' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * Hook to manage tour state
 */
export const useOnboardingTour = (userEmail) => {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (userEmail) {
      const hasSeenTour = localStorage.getItem(`tour_completed_${userEmail}`);
      setShowTour(!hasSeenTour);
    }
  }, [userEmail]);

  const resetTour = () => {
    if (userEmail) {
      localStorage.removeItem(`tour_completed_${userEmail}`);
      setShowTour(true);
    }
  };

  return { showTour, setShowTour, resetTour };
};

export default OnboardingTour;
