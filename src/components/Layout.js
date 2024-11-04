import React from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '../redux/actions/authActions';
import darkLogo from '../assets/images/logos/dark_logo.png';
import { toast } from 'react-toastify';



const Layout = ({ children}) => {
  
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
    toast.success('logged out successfully!');
  };

  const handleLogin = (email) => {
    // Simulate login success with user email
    dispatch(loginUser(email));
  };

  return (
    <div>
      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
            <img
                      src={darkLogo}
                      width={40}
                      alt=""
                    />  Media App
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-center"> {/* Aligns items to the right */}
                {isAuthenticated ? (
                  <>
                    <li className="nav-item me-2">
                      <span className="navbar-text">Hi, {user.name} </span> {/* Display user's name */}
                    </li>
                    <li className="nav-item">
                      <button className="btn btn-outline-danger" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/auth">
                      Login/Register
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <main style={{ padding: '20px' }}>{children}</main>
    </div>
  );
};

export default Layout;
