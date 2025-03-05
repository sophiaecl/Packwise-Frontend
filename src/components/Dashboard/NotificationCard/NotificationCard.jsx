import styles from "./NotificationCard.module.css";

function NotificationCard({ icon, text }) {
  return (
    <article className={styles.notificationCard}>
      <div className={styles.icon} dangerouslySetInnerHTML={{ __html: icon }} />
      <p className={styles.notificationText}>{text}</p>
    </article>
  );
}

export default NotificationCard;
