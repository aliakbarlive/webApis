import React, { useState } from 'react';

import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  verifyEmail,
  resendVerificationEmail,
} from 'features/onboarding/onboardingSlice';

import styled from 'styled-components';
import ReactCodeInput from 'react-verification-code-input';
import { Button } from 'reactstrap';

const S_CodeInput = styled(ReactCodeInput)`
  margin: 0 auto;
  margin-bottom: 2rem;

  input:focus {
    border: 1px solid #fb3767;
    caret-color: #fb3767;
  }
`;

const EmailVerify = ({ history, email }) => {
  const dispatch = useDispatch();

  const [token, setToken] = useState(null);

  const onVerify = () => {
    dispatch(verifyEmail(token, history));
  };

  const onResendVerification = (e) => {
    dispatch(resendVerificationEmail());
  };

  return (
    <div className="text-center px-4">
      <div className="mb-3">
        <h3>Verify your email</h3>
        <p>Please enter the verification code sent to {email}</p>
      </div>

      <S_CodeInput onChange={setToken} type="text" />

      <div className="d-flex flex-column align-items-center">
        <Button className="mb-3" color="primary" size="lg" onClick={onVerify}>
          Verify
        </Button>

        <Button color="link" onClick={onResendVerification}>
          Resend verification code
        </Button>
      </div>
    </div>
  );
};

export default withRouter(EmailVerify);
