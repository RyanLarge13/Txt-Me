import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav.tsx";
import Home from "./states/Home.tsx";
import Login from "./states/Login.tsx";
import SignUp from "./states/SignUp.tsx";
import Profile from "./states/Profile.tsx";

const App = () => {
 return (
  <Router>
    <Nav />
   <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login/:type" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/profile" element={<Profile />} />
   </Routes>
  </Router>
 );
};

export default App;
