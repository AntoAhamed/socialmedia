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
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './features/userSlice';
import SavedItems from './components/user/SavedItems';
import FriendRequests from './components/user/FriendRequests';

function App() {
  const dispatch = useDispatch();
  const { user, isAuth } = useSelector(state => state.user);

  //To handle active components
  const [activeComponent, setActiveComponent] = useState("home");
  const handleComponent = (active) => {
    setActiveComponent(active)
    localStorage.setItem('active', active)
  }

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch]);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isAuth && <Navbar user={user} activeComponent={activeComponent} setActiveComponent={setActiveComponent} handleComponent={handleComponent} />}>
            <Route index element={isAuth ? <Home handleComponent={handleComponent} user={user} /> : <Login />} />
            <Route path="signup" element={isAuth ? <Home handleComponent={handleComponent} user={user} /> : <Signup />} />
            <Route path="home" element={isAuth ? <Home handleComponent={handleComponent} user={user} /> : <Login />} />
            <Route path="create-post" element={isAuth ? <CreatePost user={user} /> : <Login />} />
            <Route path="friend-requests" element={isAuth ? <FriendRequests handleComponent={handleComponent} /> : <Login />} />
            <Route path="saved-items" element={isAuth ? <SavedItems /> : <Login />} />
            <Route path="edit-post/:id" element={isAuth ? <EditPost user={user} /> : <Login />} />
            <Route path="search" element={isAuth ? <Search handleComponent={handleComponent} /> : <Login />} />
            <Route path="notifications" element={isAuth ? <Notifications handleComponent={handleComponent} /> : <Login />} />
            <Route path="profile" element={isAuth ? <Profile handleComponent={handleComponent} /> : <Login />} />
            <Route path="profile/:id" element={isAuth ? <UserProfile handleComponent={handleComponent} /> : <Login />} />
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
