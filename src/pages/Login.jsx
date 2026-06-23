import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Login() {
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [error,setError]= useState("");
  

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/auth/login",{phone:phone}
      );

      setUser(res.data);
      alert("ברוכה הבאה " + res.data.name);
      localStorage.setItem("customer",JSON.stringify(res.data));
     // setError("");
      if (res.data.role === "ADMIN"){
        navigate("/adminappointments")
      } 
      else{

       navigate("/appointments");
      }
     

    } catch (err) {
      if (err.response?.status === 404) {
        alert("משתמש לא קיים");
       // setError("משתמש לא קיים");
      } else {
        console.log("Error:",err);
        console.log("Message:",err.message);
        console.log("Response:",err.response);
        alert("שגיאה בהתחברות");
      }
    }
  };

  return (
    <div className={styles.page}>
    <div className={styles.card}>
    <div className={styles.title}> התחברות </div>
    <div className={styles.form}>

      <input className={styles.input}
        placeholder="מספר טלפון"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <br /><br />

      <button  className= {styles.button} onClick={handleLogin}>
        התחברות
      </button>
      <p>
        אין לך משתמש? <Link className={styles.link} to="/register">להרשמה</Link>
      </p>
      </div>
      </div>

   </div>
  );
}

export default Login;