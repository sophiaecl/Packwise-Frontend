import styles from "./StatsCard.module.css";

function StatsCard({ title, value }) {
  return (
    <article className={styles.statCard}>
      <h3 className={styles.statTitle}>{title}</h3>
      <p className={styles.statValue}>{value}</p>
    </article>
  );
}

export default StatsCard;
