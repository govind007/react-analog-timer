import React from 'react';
import ReactDOM from 'react-dom';
import AnalogTimer from './AnalogTimer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AnalogTimer />, div);
  ReactDOM.unmountComponentAtNode(div);
});
