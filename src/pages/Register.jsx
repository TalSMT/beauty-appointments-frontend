import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";  
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  //const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
     e.preventDefault();
    try{
      await
      axios.post(`${import.meta.env.VITE_API_URL}/customers`,{name,phone});
      toast.success("נרשמת בהצלחה");
      navigate("/");
    }
    catch{
      toast.error("שגיאה בהרשמה");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
      <h2 className={styles.title}>הרשמה</h2>
       <form className={styles.form} onSubmit={handleRegister}>


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
     
      <button className={styles.button} type="submit">
        הרשמה
      </button>
      <p>
        יש לך משתמש? <Link className={styles.link} to="/login">להתחברות</Link>
       </p>
       </form>
    </div>
    </div>
  );
}

export default Register;