import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Appointments from "./pages/Appointments";
import AdminAppointments from "./pages/AdminAppointments";
import BookAppointment from "./pages/BookAppointment";

function App(){
  const user = JSON.parse(localStorage.getItem("customer"));
  console.log("user:",user);
  return(
    <Routes>
      
      <Route path="/register" element = {<Register/>}/>
      <Route path="/login" element = {<Login/>}/>
      <Route path="/book" element = {<BookAppointment/>}/>
       <Route path="/adminappointments" element = {<AdminAppointments/>}/>
      <Route path="/appointments" element = {user?.role==="ADMIN"? <AdminAppointments/>:<Appointments/>}/>
    </Routes>
  );
}
export default App;