import React from 'react';
import { createRoot } from 'react-dom/client';
import UI from './ui';

import './styles/global.scss';

const container = document.getElementById('react-page');
const root = createRoot(container);
root.render(<UI />);