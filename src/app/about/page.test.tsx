import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutPage from './page'; // Default export from page.tsx

// Mock child components
jest.mock('@/components/about/CompanyHistory', () => {
  return function DummyCompanyHistory() {
    return <div data-testid="company-history">CompanyHistory Mock</div>;
  };
});

jest.mock('@/components/about/OurTeam', () => {
  return function DummyOurTeam() {
    return <div data-testid="our-team">OurTeam Mock</div>;
  };
});

jest.mock('@/components/about/CertificatesAndAwards', () => {
  return function DummyCertificatesAndAwards() {
    return <div data-testid="certificates-awards">CertificatesAndAwards Mock</div>;
  };
});

jest.mock('@/components/about/VisionAndValues', () => {
  return function DummyVisionAndValues() {
    return <div data-testid="vision-values">VisionAndValues Mock</div>;
  };
});

// Mock AOS library if its absence causes issues, or if we want to avoid its side effects
// For now, we'll assume it doesn't break rendering if not initialized.
// If 'data-aos' attributes themselves cause issues with Jest/JSDOM,
// we might need a more sophisticated mock or setup.

describe('About Page', () => {
  test('renders the main heading and all mocked child components', () => {
    render(<AboutPage />);

    // Check for the main heading (text in Persian)
    // Using a regex to be more flexible with potential surrounding whitespace or elements
    expect(screen.getByRole('heading', { name: /درباره ما/i })).toBeInTheDocument();

    // Check if mocked components are rendered
    expect(screen.getByTestId('company-history')).toBeInTheDocument();
    expect(screen.getByText('CompanyHistory Mock')).toBeInTheDocument();

    expect(screen.getByTestId('our-team')).toBeInTheDocument();
    expect(screen.getByText('OurTeam Mock')).toBeInTheDocument();

    expect(screen.getByTestId('certificates-awards')).toBeInTheDocument();
    expect(screen.getByText('CertificatesAndAwards Mock')).toBeInTheDocument();

    expect(screen.getByTestId('vision-values')).toBeInTheDocument();
    expect(screen.getByText('VisionAndValues Mock')).toBeInTheDocument();
  });

  test('sets the document title', () => {
    render(<AboutPage />);
    // Note: useEffect runs after the component mounts.
    // Testing document.title modification in JSDOM can sometimes be tricky
    // or require waiting for the effect.
    // For this test, we'll check the title after rendering.
    expect(document.title).toBe('درباره ما | پارس گستر اسپرلوس خزر');
  });
});
