 import { useEffect, useState } from "react";
 import axios from "axios";
 import Navbar from "../assets/components/Navbar";
 import { Link ,useNavigate} from "react-router-dom";
 import styles from "./AdminBusinessHours.module.css";  
 import { toast } from "react-toastify";



  function AdminBusinessHours() {

    const [hours , setHours] = useState([]);
    const [conflicts, setConflicts] = useState([]);

    useEffect(()=>{
        axios.get(`${import.meta.env.VITE_API_URL}/business-hours`)
        .then(res=> setHours(res.data))
        .catch(err => console.log(err),[]);
    },[]);

    const save = async () => {
        try{
            const conflictResponse = 
            await axios.post(`${import.meta.env.VITE_API_URL}/business-hours/check-conflicts`,hours);
            console.log(conflictResponse.data);

            if(conflictResponse.data.hasConflicts){
                setConflicts(conflictResponse.data.appointments);
                return;
            }
             await axios.put(`${import.meta.env.VITE_API_URL}/business-hours`,hours);
             toast.success("השעות נשמרו בהצלחה");
            }
        catch(err){
            toast.error("אירעה שגיאה");
        }

        
    }

    const handleChange = (id, field,value) =>{
        setHours(prev => prev.map(h => h.id===id? {...h,[field]:value}: h));
    }
    const dayNames = {
        SUNDAY : "ראשון",
        MONDAY : "שני",
        TUESDAY : "שלישי",
        WEDNESDAY : "רביעי",
        THURSDAY : "חמישי",
        FRIDAY :"שישי",
        SATURDAY : "שבת"
    };
    const formatDateTime = (dateTime) =>{
        const date = new Date (dateTime);
        return date.toLocaleString("he-IL",{
            day:"2-digit",
            month:"2-digit",
            year:"numeric",
            hour:"2-digit",
            minute:"2-digit"

        });

    }

    return (
        <div className={styles.pageContainer}>
            <Navbar/>
        <h2 className={styles.title}>ניהול שעות פעילות</h2>
        <div className={styles.tableContainer}>
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>יום</th>
                    <th>פתוח</th>
                    <th>שעת התחלה</th>
                    <th>שעת סיום</th>
                </tr>
            </thead>
            <tbody>
               {hours.map(h => (
               <tr key={h.id} className={styles.card}>
               <td>{dayNames[h.dayOfWeek]}</td>

               <td>
               <input
               type="checkbox"
               checked={h.open ?? false}
               onChange={(e)=> handleChange(h.id,"open",e.target.checked)} />
                </td>

                <td>
                <input
                type="time"
                value={h.startTime || " "}
                disabled={!h.open}
                onChange={(e)=> handleChange(h.id,"startTime",e.target.value)}/>
                </td>

                <td>
                <input
                type="time"
                value={h.endTime || " "}
                disabled={!h.open}
                onChange={(e)=> handleChange(h.id,"endTime",e.target.value)}/>
                </td>
                </tr>
            
           )
          )
        }
        </tbody>
        </table>
        
        <button className = {styles.saveButton} onClick={save}>שמור</button>
        {conflicts.length >0 && (
            <div>
                <h3> :התורים שמתנגשים</h3>
                {conflicts.map(a => (
                    <div key={a.id}>  {a.customer.name} | {formatDateTime(a.dateTime)} </div>
                ))}
                </div>
        )
        }

        </div>
      </div>
    
    );
  }

  export default AdminBusinessHours;