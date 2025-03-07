import styles from "./TripCard.module.css";
import { Link } from "react-router-dom";

function TripCard({ trip_id, name, date, status, progress }) {
  const getProgressClass =
    status === "completed" ? styles.progressCompleted : styles.progress;
  const getProgressValueClass =
    status === "completed"
      ? styles.progressValueCompleted
      : styles.progressValue;

  return (
    <Link to={`/trip/${trip_id}`} className={styles.cardLink}>
      <article className={styles.tripCard}>
        <div className={styles.tripInfo}>
          <h3 className={styles.tripName}>{name}</h3>
          <time className={styles.tripDate}>{date}</time>
        </div>
        <span className={styles.tripStatus}>{status}</span>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={getProgressClass} style={{ width: `${progress}%` }} />
          </div>
          <span className={getProgressValueClass}>{progress}%</span>
        </div>
      </article>
    </Link>
  );
}

export default TripCard;