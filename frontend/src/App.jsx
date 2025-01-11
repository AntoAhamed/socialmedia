import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/layout/Navbar';
import Login from './components/layout/Login';
import Signup from './components/layout/Signup';
import Home from './components/post/Home';
import CreatePost from './components/post/CreatePost';
import Search from './components/user/Search';
import Notifications from './components/user/Notifications';
import Profile from './components/user/Profile';
import NoPage from './components/layout/NoPage';
import Footer from './components/layout/Footer';
import UpdateProfile from './components/user/UpdateProfile'
import UpdatePassword from './components/user/UpdatePassword'
import ForgotPassword from './components/user/ForgotPassword';
import ResetPassword from './components/user/ResetPassword';
import UserProfile from './components/user/UserProfile';
import EditPost from './components/post/EditPost';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './features/userSlice';
import SavedItems from './components/user/SavedItems';

function App() {
  const dispatch = useDispatch();
  const { user, isAuth } = useSelector(state => state.user);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  console.log(user)
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isAuth && <Navbar />}>
            <Route index element={isAuth ? <Home /> : <Login />} />
            <Route path="signup" element={isAuth ? <Home /> : <Signup />} />
            <Route path="home" element={isAuth ? <Home /> : <Login />} />
            <Route path="create-post" element={isAuth ? <CreatePost /> : <Login />} />
            <Route path="saved-items" element={isAuth ? <SavedItems saves={user?.saves} /> : <Login />} />
            <Route path="edit-post/:id" element={isAuth ? <EditPost /> : <Login />} />
            <Route path="search" element={isAuth ? <Search /> : <Login />} />
            <Route path="notifications" element={isAuth ? <Notifications /> : <Login />} />
            <Route path="profile" element={isAuth ? <Profile /> : <Login />} />
            <Route path="profile/:id" element={isAuth ? <UserProfile /> : <Login />} />
            <Route path="update-profile" element={isAuth ? <UpdateProfile /> : <Login />} />
            <Route path="update-password" element={isAuth ? <UpdatePassword /> : <Login />} />
            <Route path="forgot-password" element={!isAuth ? <ForgotPassword /> : <NoPage />} />
            <Route path="reset-password/:token" element={!isAuth ? <ResetPassword /> : <NoPage />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
