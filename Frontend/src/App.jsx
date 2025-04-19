import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Register";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Registration from "./pages/registration";
import InstructorProfile from './pages/InstructorProfile';


function App() {
  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/:username" element={<InstructorProfile />} />
    
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
