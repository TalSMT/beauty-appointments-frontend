import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div style={{ padding: 20 }}>
      <h2>Register</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <br /><br />

      
      <button onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}

export default Register;