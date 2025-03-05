import styles from "./NotificationsSection.module.css";
import NotificationCard from "../NotificationCard/NotificationCard";

function NotificationsSection() {
  const notifications = [
    {
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.663 17H14.336M12 3V4M18.364 5.636L17.657 6.343M21 12H20M4 12H3M6.343 6.343L5.636 5.636M8.464 15.536C7.76487 14.8367 7.2888 13.9458 7.09598 12.9759C6.90316 12.006 7.00225 11.0008 7.38073 10.0872C7.75921 9.17366 8.40007 8.39284 9.22229 7.84349C10.0445 7.29414 11.0111 7.00093 12 7.00093C12.9889 7.00093 13.9555 7.29414 14.7777 7.84349C15.5999 8.39284 16.2408 9.17366 16.6193 10.0872C16.9977 11.0008 17.0968 12.006 16.904 12.9759C16.7112 13.9458 16.2351 14.8367 15.536 15.536L14.988 16.083C14.6747 16.3963 14.4262 16.7683 14.2567 17.1777C14.0872 17.5871 13.9999 18.0259 14 18.469V19C14 19.5304 13.7893 20.0391 13.4142 20.4142C13.0391 20.7893 12.5304 21 12 21C11.4696 21 10.9609 20.7893 10.5858 20.4142C10.2107 20.0391 10 19.5304 10 19V18.469C10 17.574 9.644 16.715 9.012 16.083L8.464 15.536Z" stroke="#A8707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
      text: "Your Paris trip is in 2 weeks! Complete your packing list.",
    },
    {
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8V12L15 15M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke="#A8707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
      text: "New AI-generated items available for your Tokyo trip",
    },
  ];

  return (
    <section className={styles.notificationsSection}>
      <h2 className={styles.notificationsTitle}>Notifications</h2>
      {notifications.map((notification, index) => (
        <NotificationCard key={index} {...notification} />
      ))}
    </section>
  );
}

export default NotificationsSection;
