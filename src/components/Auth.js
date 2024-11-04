import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, registerUser } from '../redux/actions/authActions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import darkLogo from '../assets/images/logos/dark_logo.png';

const AuthNew = () => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const initialValues = {
    name: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().when('isLogin', {
      is: false,
      then: Yup.string().required('Name is required'),
    }),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values) => {
    try {
      const response = isLogin
        ? await dispatch(loginUser({ email: values.email, password: values.password }))
        : await dispatch(registerUser(values));
        
      if (response.status === 200 || response.status === 201) {
        toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
        navigate('/media-list');
        setErrorMessage('');
      } else {
        const message = response.data.message || 'An unexpected error occurred. Please try again.';
        setErrorMessage(message);
        toast.error(message);
      }
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'An unexpected error occurred. Please try again.';
      setErrorMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
  };

  return (
    <div
      className="page-wrapper"
      id="main-wrapper"
      data-layout="vertical"
      data-navbarbg="skin6"
      data-sidebartype="full"
      data-sidebar-position="fixed"
      data-header-position="fixed"
    >
      <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
        <div className="d-flex align-items-center justify-content-center w-100">
          <div className="row justify-content-center w-100">
            <div className="col-md-8 col-lg-4 col-xxl-4">
              <div className="card mb-0">
                <div className="card-body">
                  <h3 className='mb-5 text-center'>{isLogin ? 'Login' : 'Register'}</h3>

                  <a
                    href="#"
                    className="text-nowrap logo-img text-center d-block py-3 w-100"
                  >
                    <img
                      src={darkLogo}
                      width={180}
                      alt=""
                    />
                  </a>
                  <p className="text-center">Welcome to Media App</p>

                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ handleSubmit }) => (
                      <Form onSubmit={handleSubmit}>
                        {!isLogin && (
                          <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <Field
                              type="text"
                              className="form-control"
                              id="name"
                              name="name"
                            />
                            <ErrorMessage name="name" component="div" className="text-danger" />
                          </div>
                        )}
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email</label>
                          <Field
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                          />
                          <ErrorMessage name="email" component="div" className="text-danger" />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="password" className="form-label">Password</label>
                          <Field
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                          />
                          <ErrorMessage name="password" component="div" className="text-danger" />
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary w-100 fs-4 mb-4 rounded-2"
                        >
                          {isLogin ? 'Login' : 'Register'}
                        </button>
                        <div className="d-flex align-items-center justify-content-center">
                          <button type="button" className="btn btn-link" onClick={toggleForm}>
                            {isLogin ? 'Create an account' : 'Already have an account? Login'}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthNew;
