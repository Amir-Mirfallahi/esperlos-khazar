import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './button'; // Assuming the component is exported as Button

describe('Button Component', () => {
  test('renders with default props and children', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('bg-primary'); // Default variant
    expect(buttonElement).toHaveClass('py-2.5'); // Default size 'md'
  });

  test('renders as a button element by default', () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('displays loading state when isLoading is true', () => {
    render(<Button isLoading>Loading...</Button>);
    const buttonElement = screen.getByRole('button', { name: /در حال پردازش.../i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeDisabled();
    expect(buttonElement.querySelector('svg')).toBeInTheDocument(); // Check for spinner
    // Check for the specific loading text, which seems to be in Persian
    expect(screen.getByText(/در حال پردازش.../i)).toBeInTheDocument();
  });

  test('renders as a Next.js Link when "to" prop is provided', () => {
    render(<Button to="/home">Go Home</Button>);
    // The role of a link is 'link'
    const linkElement = screen.getByRole('link', { name: /go home/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/home');
    // Check if it's specifically a Next.js Link (tricky without inspecting internals,
    // but checking href is a good start. Actual navigation is out of scope for unit test)
  });

  test('renders as an anchor tag when "href" prop is provided (and "to" is not)', () => {
    render(<Button href="https://example.com">External Link</Button>);
    const linkElement = screen.getByRole('link', { name: /external link/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://example.com');
    expect(linkElement.tagName).toBe('A');
  });

  test('applies variant classes correctly', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    expect(screen.getByRole('button', { name: /secondary button/i })).toHaveClass('bg-secondary');
  });

  test('applies size classes correctly', () => {
    render(<Button size="sm">Small Button</Button>);
    expect(screen.getByRole('button', { name: /small button/i })).toHaveClass('py-1.5'); // 'sm' size
  });

  test('disables the button when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    expect(screen.getByRole('button', { name: /disabled button/i })).toBeDisabled();
  });

  test('passes other HTML button attributes', () => {
    render(<Button type="submit">Submit Button</Button>);
    expect(screen.getByRole('button', { name: /submit button/i })).toHaveAttribute('type', 'submit');
  });
});
