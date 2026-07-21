import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../assets/components/Navbar";
import { data, Link , useNavigate, useParams} from "react-router-dom";
import styles from "./BookAppointment.module.css";
import { toast } from "react-toastify";
import { useRef } from "react";

function BookAppointment() {
  const [treatments, setTreatments] = useState([]);
  const [treatmentId, setTreatmentId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [availableHours, setAvailableHours] = useState([]);
  const dateRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("customer"));
  const navigate = useNavigate();
  const {id} = useParams();

  if (!user){ return <p> צריך להתחבר</p>};

  useEffect(() => {
    const loadData = async ()=>{
      try{
        //טעינת טיפולים
        const treatmentsRes = await axios.get(`http://localhost:8080/treatments`);
       setTreatments(treatmentsRes.data);
       //אם מדובר בעריכה- טען פרטי תור
       if (id){
        const appointmentRes = await axios.get(`http://localhost:8080/appointments/${id}`);
        console.log(appointmentRes.data);
        const treatment = appointmentRes.data.treatmentId;
        const dt = appointmentRes.data.dateTime;
        setTreatmentId(treatment);
        setSelectedDate(dt.substring(0,10)); 
        setSelectedHour(dt.substring(11,16));
        await loadAvailableHours(dt.substring(0,10),treatment);

       }
      }
       catch(err){
        console.log(err);

       }
      
      };
      loadData();
   },[id]);
    
   useEffect(()=>{
    if(selectedDate && treatmentId){
      loadAvailableHours(selectedDate,treatmentId);
    }
   
   }, [selectedDate,treatmentId])

  

  const handleSaveAppointment = async () => {
  try {
    const dateTime = `${selectedDate}T${selectedHour}`
    if(id){
      await axios.put(`http://localhost:8080/appointments/${id}`,{

      dateTime,
      treatment:{id :treatmentId},
      customer:{id: user.id}
    });
    toast.success("התור עודכן בהצלחה");
    }
    else{
       await axios.post(`http://localhost:8080/appointments`, {
         dateTime,
         treatmentId,
          customerId: user.id
        });

      toast.success("התור נוצר בהצלחה 🎉");
    }
    navigate("/appointments");
    // איפוס טופס
    setDateTime("");
    setTreatmentId("");
    

  } catch (err) {
    if (err.response?.status === 409) {
      toast.error("השעה כבר תפוסה ❌");
    } else {
      toast.error("שגיאה ביצירת תור");
    }
  }
};

const formatSelectedDate = (value) => {
  if (!value) return "";
  
  const date = new Date(value);

  return `${date.toLocaleDateString("he-IL")} בשעה ${date.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit"
  })}`;
};

const loadAvailableHours = async (data,treatment) =>{
  try{
    const response = await axios.get(`http://localhost:8080/appointments/available-hours`,{params:{
      date : data,
      treatmentId : treatment
    }});
    setAvailableHours(response.data);
  }
  catch(err){
    console.log(err);
  }
}

   return (
  <div className = {styles.pageContainer}>
    <Navbar />

      <h2 className={styles.title}> {id?"עריכת תור" : "קביעת תור"} </h2>

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
        ? `${styles.treatmentItem} ${styles.selectedTreatment}`
        : styles.treatmentItem
    }
  >
    💇 {t.name} ({t.durationMinutes} דק')
  </div>
))}
          
        </div>

  <div
  onClick={() => dateRef.current?.showPicker()}
  className={styles.selected}
>
  {selectedDate ? (
    <>
      📅 {new Date(selectedDate).toLocaleDateString("he-IL")}
      {selectedHour && ` | 🕒 ${selectedHour}`}
    </>
  ) : (
    "📅 בחרי תאריך"
  )}
</div>

<input
ref = {dateRef}
  type="date"
  value={selectedDate}
  onChange={(e) => {setSelectedDate(e.target.value);
  /*loadAvailableHours(e.target.value,treatmentId);*/
  }}
  className={styles.input}
/>
{availableHours.length > 0 ? (
  <div>
    <h4>בחרי שעה:</h4>

    {availableHours.map((hour) => (
      <button
        key={hour}
        onClick={() => setSelectedHour(hour)}
        className={selectedHour=== hour? `${styles.hourButton} ${styles.selectedHour}`:styles.hourButton}
      >
        {hour}
      </button>
    ))}

  </div>
) : (
  selectedDate && (
    <p>
      אין שעות פנויות בתאריך שנבחר
    </p>
  )
)}



        {/* כפתור */}
        <button
          onClick={handleSaveAppointment}
          className={styles.button}
          disabled={!treatmentId || !selectedDate || !selectedHour}
        >
         {id? "שמרי שינויים": "קבעי תור"}
        </button>

      </div>
);
}

export default BookAppointment;