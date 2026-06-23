 import { useEffect, useState } from "react";
 import axios from "axios";
 import Navbar from "../assets/components/Navbar";
 import { Link } from "react-router-dom";
 import styles from "./Appointments.module.css";  


 function Appointments() {
//   const [treatments, setTreatments] = useState([]);
//   const [treatmentId, setTreatmentId] = useState("");
//   const [dateTime, setDateTime] = useState("");
   const [appointments,setAppointments]=useState([]);
   const user = JSON.parse(localStorage.getItem("customer"));
   const formatDate = (dt)=>{
    if(!dt) return "";
    if(typeof dt === "object")
        {return `${dt.day}/${dt.month}/${dt.year}${dt.hour}:${dt.minute}`};
   return String(dt).replace("T"," ")
    };
   if (!user){ return <p> צריך להתחבר</p>};



  useEffect(()=>{
    axios.get(`http://localhost:8080/appointments`,{params:{customerId:user.id}})
      .then(res=>setAppointments(res.data))
      .catch(err=>console.log(err));
  }, []);

return (
  <div
    className = {styles.pageContainer}>
    <Navbar />


      <h2 className={styles.title}>התורים שלי </h2>

      {appointments.length === 0 ? (
        <p className={styles.emptyText}>אין תורים</p>
      ) : (
        <div className={styles.list}>

          {appointments.map((appointment) => (
            <div
              key={appointment.id}
             className={styles.card}>

              {/* תאריך */}
              <div className={styles.date}>
                📅 {formatDate(appointment.dateTime)}
              </div>

              {/* טיפול */}
              <div className={styles.treatment}>
                💇 {appointment.treatment?.name}
              </div>

              {/* כפתור */}
              <button className={styles.cancelBtn}
                onClick={() => handleCancel(appointment.id)}
                >
                ביטול תור
              </button>

            </div>
          ))}

        </div>
      )}

      {/* כפתור מעבר */}
        <Link
          to="/book"
         className={styles.link}
        >
          + קביעת תור חדש
        </Link>
      </div>
);

 
}

export default Appointments;