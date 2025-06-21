import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';

describe('Card Components', () => {
  describe('Card', () => {
    test('renders children and applies default classes', () => {
      render(<Card data-testid="card">Card Content</Card>);
      const cardElement = screen.getByTestId('card');
      expect(cardElement).toBeInTheDocument();
      expect(cardElement).toHaveTextContent('Card Content');
      expect(cardElement).toHaveClass('rounded-lg border bg-card text-card-foreground shadow-sm');
    });

    test('applies custom className', () => {
      render(<Card className="custom-card" data-testid="card">Card Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('custom-card');
    });
  });

  describe('CardHeader', () => {
    test('renders children and applies default classes', () => {
      render(<CardHeader data-testid="card-header">Header Content</CardHeader>);
      const headerElement = screen.getByTestId('card-header');
      expect(headerElement).toBeInTheDocument();
      expect(headerElement).toHaveTextContent('Header Content');
      expect(headerElement).toHaveClass('flex flex-col space-y-1.5 p-6');
    });
  });

  describe('CardTitle', () => {
    test('renders children as h3 and applies default classes', () => {
      render(<CardTitle data-testid="card-title">Title</CardTitle>);
      const titleElement = screen.getByTestId('card-title');
      expect(titleElement).toBeInTheDocument();
      expect(titleElement.tagName).toBe('H3');
      expect(titleElement).toHaveTextContent('Title');
      expect(titleElement).toHaveClass('text-2xl font-semibold');
    });
  });

  describe('CardDescription', () => {
    test('renders children as p and applies default classes', () => {
      render(<CardDescription data-testid="card-description">Description</CardDescription>);
      const descriptionElement = screen.getByTestId('card-description');
      expect(descriptionElement).toBeInTheDocument();
      expect(descriptionElement.tagName).toBe('P');
      expect(descriptionElement).toHaveTextContent('Description');
      expect(descriptionElement).toHaveClass('text-sm text-muted-foreground');
    });
  });

  describe('CardContent', () => {
    test('renders children and applies default classes', () => {
      render(<CardContent data-testid="card-content">Main Content</CardContent>);
      const contentElement = screen.getByTestId('card-content');
      expect(contentElement).toBeInTheDocument();
      expect(contentElement).toHaveTextContent('Main Content');
      expect(contentElement).toHaveClass('p-6 pt-0');
    });
  });

  describe('CardFooter', () => {
    test('renders children and applies default classes', () => {
      render(<CardFooter data-testid="card-footer">Footer Content</CardFooter>);
      const footerElement = screen.getByTestId('card-footer');
      expect(footerElement).toBeInTheDocument();
      expect(footerElement).toHaveTextContent('Footer Content');
      expect(footerElement).toHaveClass('flex items-center p-6 pt-0');
    });
  });

  test('renders a full card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Card Title</CardTitle>
          <CardDescription>Test Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Test card main content.</p>
        </CardContent>
        <CardFooter>
          <p>Test card footer.</p>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Test Card Title')).toBeInTheDocument();
    expect(screen.getByText('Test Card Description')).toBeInTheDocument();
    expect(screen.getByText('Test card main content.')).toBeInTheDocument();
    expect(screen.getByText('Test card footer.')).toBeInTheDocument();
  });
});
