import { Link, useNavigate, NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("customer"));
  const isAdmin = user?.role === "ADMIN";

  const logout = () => {
    localStorage.removeItem("customer");
    navigate("/login");
  };

  return (
    <div className={styles.navbar}>

      {/* קישורים */}
      <div className={styles.links}>

        {!isAdmin && (
          <NavLink
            to="/book"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            קביעת תור
          </NavLink>
        )}

        {!isAdmin && (
          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            התורים שלי
          </NavLink>
        )}

        {isAdmin && (
          <Link className={styles.link} to="/adminappointments">
            ניהול
          </Link>
        )}

      </div>

      {/* צד ימין */}
      <div className={styles.user}>
        <span>שלום {user?.name}</span>

        <button className={styles.logoutBtn} onClick={logout}>
          התנתקות
        </button>
      </div>

    </div>
  );
}

export default Navbar;