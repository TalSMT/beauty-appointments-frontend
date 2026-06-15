import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState(null);
   const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/customers/phone/${phone}`
      );

      setUser(res.data);
      alert("ברוכה הבאה " + res.data.name);
      localStorage.setItem("customer",JSON.stringify(res.data));
      navigate("/appointments");

    } catch (err) {
      if (err.response?.status === 404) {
        alert("משתמש לא קיים");
      } else {
        console.log("Error:",err);
        console.log("Message:",err.message);
        console.log("Response:",err.response);
        alert("שגיאה בהתחברות");
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>
        Login
      </button>
      <p>
        אין לך משתמש? <Link to="/register">להרשמה</Link>
      </p>

      
    </div>
  );
}

export default Login;