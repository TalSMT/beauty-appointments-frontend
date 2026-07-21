 import { useEffect, useState } from "react";
 import axios from "axios";
 import Navbar from "../assets/components/Navbar";
 import { Link ,useNavigate} from "react-router-dom";
 import styles from "./Appointments.module.css";  
 import { toast } from "react-toastify";


 function Appointments() {
   const [history, setHistory] = useState([]);
   const [appointments,setAppointments]=useState([]);
   const user = JSON.parse(localStorage.getItem("customer"));
   const navigate = useNavigate();
   const [showHistory, setShowHistory] = useState(false);

   const formatDate = (dt)=>{
    if(!dt) return "";
    if(typeof dt === "object")
        {return `${dt.day}/${dt.month}/${dt.year}${dt.hour}:${dt.minute}`};
   return String(dt).replace("T"," ")
    };
   if (!user){ return <p> צריך להתחבר</p>};


   const loadAppointments = async () => {
    try {
      const activeResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/appointments/customers`,
        { params: { customerId: user.id } }
      );

      setAppointments(activeResponse.data);

      const historyResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/appointments/history`,
        { params: { customerId: user.id } }
      );

      setHistory(historyResponse.data);

      } catch (err) {
         console.log(err);
       }
    };

   useEffect(() => {
     loadAppointments();
    }, []);

 

    const handleCancel = async (id) =>{
      console.log("DELETE ID:",id);
      console.log("URL:",`${import.meta.env.VITE_API_URL}/appointments/${id}/cancel`);
      if(!window.confirm("לבטל את התור?")) return;
      try{
          await axios.put(`${import.meta.env.VITE_API_URL}/appointments/${id}/cancel`);
      
      
      toast.error("❌ התור בוטל ");
      console.log(id);

      /*const response = await axios.get(`${import.meta.env.VITE_API_URL}/appointments/customers`,{params:{customerId:user.id}});*/
      await loadAppointments();
      setAppointments(response.data);
      }
      catch (err){
          console.log("ERROR:",err);
          console.log("RESPONSE:",err.response);
          toast.error("שגיאה בביטול תור");
  
      }
      };

      const isPastAppointment = (dateTime) => {
        return new Date(dateTime) < new Date();
      }

      const sortedHistory = [...history].sort((a,b)=> new Date(b.dateTime) - new Date(a.dateTime));

      const getStatusText = (status) =>{
        switch(status){
          case "CANCELLED":
          return "בוטל";
          case "COMPLETED":
          return "הסתיים";
          default:
          return " ";
        }
      };

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
                disabled = {isPastAppointment(appointment.dateTime)}
                >
                ביטול 
              </button>
              <button className={styles.editBtn}
              onClick={()=> navigate(`/book/${appointment.id}`)}
              >
                עריכה

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

        <div className={styles.historyHeader} onClick={()=> setShowHistory(!showHistory)}>
          <span>היסטוריית תורים</span>
          <span>{showHistory ? "▼" : "▶"}</span>
          
        </div>

{showHistory && (
  history.length === 0 ? (
    <p className={styles.emptyText}>אין היסטוריית תורים</p>
  ) : (
    <div className={styles.list}>
      {sortedHistory.map((appointment) => (
        <div key={appointment.id} className={styles.card}>
          <div className={styles.date}>
            📅 {formatDate(appointment.dateTime)}
          </div>

          <div className={styles.treatment}>
            💇 {appointment.treatment?.name}
          </div>
          <div className={styles.status}>
            {getStatusText(appointment.status)}
            </div>
        </div>
      ))}
    </div>
  )
)}
      </div>
);

 
}

export default Appointments;