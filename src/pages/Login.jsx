import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { toast } from "react-toastify";

function Login({setUser}) {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { phone: phone }
      );

      console.log("login response:", res.data);

      // שמירת המשתמש
      localStorage.setItem("customer", JSON.stringify(res.data));
      setUser(res.data);

      console.log(
        "local storage after save:",
        localStorage.getItem("customer")
      );

      toast.success("ברוכה הבאה " + res.data.name);

      // ניווט לפי סוג משתמש
      if (res.data.role === "ADMIN") {
        navigate("/adminappointments");
      } else {
        navigate("/appointments");
      }

    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("משתמש לא קיים");
      } else {
        console.log("Error:", err);
        console.log("Message:", err.message);
        console.log("Response:", err.response);
        toast.error("שגיאה בהתחברות");
      }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.title}>התחברות</div>

        <div className={styles.form}>

          <input
            className={styles.input}
            placeholder="מספר טלפון"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <br /><br />

          <button
            className={styles.button}
            onClick={handleLogin}
          >
            התחברות
          </button>

          <p>
            אין לך משתמש?{" "}
            <Link className={styles.link} to="/register">
              להרשמה
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;