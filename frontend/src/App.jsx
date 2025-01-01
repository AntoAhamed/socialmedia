import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/layout/Navbar';
import Login from './components/layout/Login';
import Signup from './components/layout/Signup';
import Home from './components/post/Home';
import CreatePost from './components/post/CreatePost';
import Search from './components/user/Search';
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

function App() {
  const dispatch = useDispatch();
  const { user, isAuth } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  console.log(user);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isAuth && <Navbar />}>
            <Route index element={isAuth ? <Home /> : <Login />} />
            <Route path="signup" element={isAuth ? <Home /> : <Signup />} />
            <Route path="home" element={isAuth && <Home />} />
            <Route path="create-post" element={isAuth && <CreatePost />} />
            <Route path="edit-post/:id" element={isAuth && <EditPost />} />
            <Route path="search" element={isAuth && <Search />} />
            <Route path="profile" element={isAuth && <Profile />} />
            <Route path="profile/:id" element={isAuth && <UserProfile />} />
            <Route path="update-profile" element={isAuth && <UpdateProfile />} />
            <Route path="update-password" element={isAuth && <UpdatePassword />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
