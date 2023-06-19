import {render, screen} from '@testing-library/react'
import React from 'react';
import App from '../src/App.js';

describe('App', function() {
  it('renders the text "Hello React"', function() {
    const subject = render(<App />);
    subject.getByText('Hello React');
  });
});
