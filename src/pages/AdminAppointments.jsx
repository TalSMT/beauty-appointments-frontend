import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../assets/components/Navbar";
import styles from "./AdminAppointments.module.css";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/appointments/active")
      .then(res => setAppointments(res.data))
      .catch(err => console.log(err));
  }, []);

  const formatDate = (dt) => {
    if (!dt) return "";
    if (typeof dt === "object") {
      return `${dt.day}/${dt.month}/${dt.year} ${dt.hour}:${dt.minute}`;
    }
    return String(dt).replace("T", " ");
  };

  return (
    <div>
      <Navbar />

      <div className={styles.pageContainer}>

        <h2 className={styles.title}>
          ניהול תורים 👑
        </h2>

        {appointments.length === 0 ? (
          <p className={styles.empty}>
            אין תורים פעילים
          </p>
        ) : (
          <div className={styles.list}>

            {appointments.map((app) => (
              <div key={app.id} className={styles.card}>

                <div className={styles.date}>
                  📅 {formatDate(app.dateTime)}
                </div>

                <div className={styles.text}>
                  💇 {app.treatment?.name}
                </div>

                <div className={styles.text}>
                  👤 {app.customer?.name}
                </div>

                <div className={styles.text}>
                  📞 {app.customer?.phone}
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default AdminAppointments;