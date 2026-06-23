import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../assets/components/Navbar";
import { Link } from "react-router-dom";
import styles from "./BookAppointment.module.css";

function BookAppointment() {
  const [treatments, setTreatments] = useState([]);
  const [treatmentId, setTreatmentId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [appointments,setAppointments]=useState([]);
  const user = JSON.parse(localStorage.getItem("customer"));

  if (!user){ return <p> צריך להתחבר</p>};

  useEffect(() => {
    axios.get(`http://localhost:8080/treatments`)
      .then(res => setTreatments(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(()=>{
    axios.get(`http://localhost:8080/appointments`,{params:{customerId:user.id}})
      .then(res=>setAppointments(res.data))
      .catch(err=>console.log(err));
  }, []);

  

  const handleCreateAppointment = async () => {
  try {
    await axios.post(`http://localhost:8080/appointments`, {
      dateTime,
      treatmentId,
      customerId: user.id
    });

    alert("התור נוצר בהצלחה 🎉");

    // איפוס טופס
    setDateTime("");
    setTreatmentId("");
  } catch (err) {
    if (err.response?.status === 409) {
      alert("השעה כבר תפוסה ❌");
    } else {
      alert("שגיאה ביצירת תור");
    }
  }
};
const handleCancel = async (id) =>{
    console.log("DELETE ID:",id);
    console.log("URL:",`http://localhost:8080/appointments/${id}/cancel`);
    if(!window.confirm("לבטל את התור?")) return;
    try{
        await axios.put(`http://localhost:8080/appointments/${id}/cancel`);
    
    setAppointments(prev =>prev.filter(app=>app.id!== id));
    alert("❌ התור בוטל ");
    
    const response = await axios.get(`http://localhost:8080/appointments`,{params:{customerId:user.id}});
    setAppointments(response.data);
    }
    catch (err){
        console.log("ERROR:",err);
        console.log("RESPONSE:",err.response);
        alert("שגיאה בביטול תור");

    }
    };
   return (
  <div className = {styles.pageContainer}>
    <Navbar />

      <h2 className={styles.title}> קביעת תור </h2>

      {/* קונטיינר ראשי */}
      <div className={styles.formCard}>

        {/* טיפולים */}
        <h4 className={styles.sectionTitle}>:בחרי טיפול</h4>

     
         {treatments.map((t) => (
  <div
    key={t.id}
    onClick={() => setTreatmentId(t.id)}
    className={
      treatmentId === t.id
        ? `${styles.treatmentItem} ${styles.selected}`
        : styles.treatmentItem
    }
  >
    💇 {t.name} ({t.durationMinutes} דק')
  </div>
))}
          
        </div>

        <div
  onClick={() => document.getElementById("dt").showPicker?.()}
  className={styles.selected}
>
  📅 {dateTime ? dateTime : "בחרי תאריך ושעה"}
</div>

<input
  id="dt"
  type="datetime-local"
  value={dateTime}
  onChange={(e) => setDateTime(e.target.value)}
  className={styles.input}
/>

        {/* כפתור */}
        <button
          onClick={handleCreateAppointment}
          className={styles.button}
        >
          קבעי תור 
        </button>

      </div>
);
}

export default BookAppointment;