import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Cabecalho from '../components/Cabecalho';

it('should render Header', () => {
  const { getByText } = render(<Cabecalho />);
  expect(getByText('Cabecalho')).toBeInTheDocument();
});