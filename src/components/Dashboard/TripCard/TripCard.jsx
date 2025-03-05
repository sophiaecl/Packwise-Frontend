import styles from "./TripCard.module.css";

function TripCard({ name, date, status, progress }) {
  const getProgressClass =
    status === "completed" ? styles.progressCompleted : styles.progress;
  const getProgressValueClass =
    status === "completed"
      ? styles.progressValueCompleted
      : styles.progressValue;

  return (
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
  );
}

export default TripCard;