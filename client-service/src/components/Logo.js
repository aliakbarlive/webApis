import React from 'react';

import styled from 'styled-components';
import { Box } from 'react-feather';

const LogoContainer = styled('a')`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;

  span {
    margin-left: 0.75rem;
    font-size: 2.5rem;
  }
`;

const Logo = () => (
  <LogoContainer>
    <Box size={45} />
    <span>BetterSeller</span>
  </LogoContainer>
);

export default Logo;
