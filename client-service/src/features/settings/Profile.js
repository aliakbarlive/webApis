import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectAuthenticatedUser, setUser } from 'features/auth/authSlice';
import { setAlert } from 'features/alert/alertSlice';

import axios from 'axios';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';

const ErrorMessage = ({ errors, attr }) => {
  if (errors[attr]) {
    return errors[attr].map((err) => {
      return (
        <div key={err} className="invalid-feedback">
          {err}
        </div>
      );
    });
  }
  return null;
};

const Profile = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthenticatedUser);

  const [errors, setErrors] = useState({});
  const [changePasswordForm, setChangePasswordForm] = useState({
    password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    setProfileForm({
      firstName: authUser.firstName,
      lastName: authUser.lastName,

      email: authUser.email,
    });
  }, [authUser]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    let updateForm = { ...profileForm };
    updateForm[name] = value;

    setProfileForm(updateForm);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    let updateForm = { ...changePasswordForm };
    updateForm[name] = value;

    setChangePasswordForm(updateForm);
  };

  const onInputFocus = (e) => {
    let updatedErrors = { ...errors };
    delete updatedErrors[e.target.name];
    setErrors(updatedErrors);
  };

  const updateProfile = () => {
    axios
      .put('/auth/me', profileForm)
      .then((res) => {
        dispatch(setUser(res.data.data));
        dispatch(setAlert(res.data.message, 'success', 1000));
      })
      .catch((err) => {
        if (err.response.status == 422) {
          const { message, errors } = err.response.data;
          dispatch(setAlert(message, 'danger', 1000));

          setErrors(errors);
        }
      });
  };

  const updatePassword = () => {
    axios
      .post('/auth/me/change-password', changePasswordForm)
      .then((res) => {
        dispatch(setAlert(res.data.message, 'success', 1000));

        setChangePasswordForm({
          password: '',
          new_password: '',
          new_password_confirmation: '',
        });
      })
      .catch((err) => {
        if (err.response.status == 422) {
          const { message, errors } = err.response.data;
          dispatch(setAlert(message, 'danger', 1000));

          setErrors(errors);
        }
      });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag="h5" className="mb-0">
            Profile Info
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Form>
            <FormGroup row>
              <Label
                for="firstName"
                sm={2}
                md={2}
                className={errors.firstName ? 'text-danger' : ''}
              >
                First Name:
              </Label>
              <Col sm={4} md={4}>
                <Input
                  name="firstName"
                  id="firstName"
                  value={profileForm.firstName || ''}
                  onChange={handleProfileChange}
                  onFocus={onInputFocus}
                  className={errors.firstName ? 'is-invalid' : ''}
                />
                <ErrorMessage errors={errors} attr="firstName"></ErrorMessage>
              </Col>
              <Label
                for="lastName"
                sm={2}
                md={2}
                className={errors.lastName ? 'text-danger' : ''}
              >
                Last Name:
              </Label>
              <Col sm={4} md={4}>
                <Input
                  name="lastName"
                  id="lastName"
                  value={profileForm.lastName || ''}
                  onChange={handleProfileChange}
                  onFocus={onInputFocus}
                  className={errors.lastName ? 'is-invalid' : ''}
                />
                <ErrorMessage errors={errors} attr="lastName"></ErrorMessage>
              </Col>
            </FormGroup>

            <FormGroup row className="mt-4">
              <Label
                for="email"
                sm={2}
                className={errors.email ? 'text-danger' : ''}
              >
                Email:
              </Label>
              <Col sm={10}>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={profileForm.email || ''}
                  onChange={handleProfileChange}
                  onFocus={onInputFocus}
                  className={errors.email ? 'is-invalid' : ''}
                />
                <ErrorMessage errors={errors} attr="email"></ErrorMessage>
              </Col>
            </FormGroup>

            <Button
              color="primary"
              className="float-right"
              onClick={() => updateProfile()}
            >
              Save changes
            </Button>
          </Form>
        </CardBody>
      </Card>

      {/* Change Password Section */}
      <Card>
        <CardHeader>
          <CardTitle tag="h5" className="mb-0">
            Change Password
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Form>
            <FormGroup row>
              <Label
                for="password"
                sm={2}
                className={errors.password ? 'text-danger' : ''}
              >
                Current Password:
              </Label>
              <Col sm={10}>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  value={changePasswordForm.password || ''}
                  onChange={handlePasswordChange}
                  onFocus={onInputFocus}
                  className={errors.password ? 'is-invalid' : ''}
                />
                <ErrorMessage errors={errors} attr="password"></ErrorMessage>
              </Col>
            </FormGroup>

            <FormGroup row className="mt-4">
              <Label
                sm={2}
                for="new_password"
                className={errors.new_password ? 'text-danger' : ''}
              >
                New Password:
              </Label>
              <Col sm={10}>
                <Input
                  type="password"
                  name="new_password"
                  id="new_password"
                  value={changePasswordForm.new_password || ''}
                  onChange={handlePasswordChange}
                  onFocus={onInputFocus}
                  className={errors.new_password ? 'is-invalid' : ''}
                />

                <ErrorMessage
                  errors={errors}
                  attr="new_password"
                ></ErrorMessage>
              </Col>
            </FormGroup>

            <FormGroup row className="mt-4">
              <Label for="newPasswordConfirmation" sm={2}>
                Confirm New Password:
              </Label>
              <Col sm={10}>
                <Input
                  type="password"
                  name="new_password_confirmation"
                  id="new_password_confirmation"
                  value={changePasswordForm.new_password_confirmation || ''}
                  onChange={handlePasswordChange}
                />
              </Col>
            </FormGroup>

            <Button
              color="primary"
              className="float-right"
              onClick={() => updatePassword()}
            >
              Save changes
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Profile;
