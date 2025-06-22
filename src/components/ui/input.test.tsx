import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from './input';

describe('Input Component', () => {
  test('renders with default props', () => {
    render(<Input data-testid="test-input" />);
    const inputElement = screen.getByTestId('test-input');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveClass('h-10 w-full rounded-md border'); // Basic styling check
  });

  test('accepts and displays a value', () => {
    render(<Input defaultValue="Test Value" data-testid="test-input" />);
    const inputElement = screen.getByTestId('test-input') as HTMLInputElement;
    expect(inputElement.value).toBe('Test Value');
  });

  test('can be disabled', () => {
    render(<Input disabled data-testid="test-input" />);
    const inputElement = screen.getByTestId('test-input');
    expect(inputElement).toBeDisabled();
  });

  test('applies custom className', () => {
    render(<Input className="custom-class" data-testid="test-input" />);
    const inputElement = screen.getByTestId('test-input');
    expect(inputElement).toHaveClass('custom-class');
  });

  test('handles onChange event', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} data-testid="test-input" />);
    const inputElement = screen.getByTestId('test-input');
    fireEvent.change(inputElement, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  test('renders with specified type', () => {
    render(<Input type="password" data-testid="test-input" />);
    const inputElement = screen.getByTestId('test-input');
    expect(inputElement).toHaveAttribute('type', 'password');
  });

  test('renders with a placeholder', () => {
    render(<Input placeholder="Enter text..." data-testid="test-input" />);
    const inputElement = screen.getByPlaceholderText('Enter text...');
    expect(inputElement).toBeInTheDocument();
  });
});
