import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";  
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  //const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try{
      await
      axios.post("http://localhost:8080/customers",{name,phone});
      alert("נרשמת בהצלחה");
      navigate("/");
    }
    catch{
      alert("שגיאה בהרשמה");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
      <h2 className={styles.title}>הרשמה</h2>

      <input className={styles.input}
        placeholder="שם מלא"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />


      <input className={styles.input}
        placeholder="טלפון"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
     
      <button className={styles.button} onClick={handleRegister}>
        הרשמה
      </button>
      <p>
        יש לך משתמש? <Link className={styles.link} to="/login">להתחברות</Link>
       </p>
    </div>
    </div>
  );
}

export default Register;