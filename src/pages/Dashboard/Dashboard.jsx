import styles from "./Dashboard.module.css";
import Header from "../../components/Dashboard/Header/Header";
import StatsCard from "../../components/Dashboard/StatsCard/StatsCard";
import TripsSection from "../../components/Dashboard/TripsSection/TripsSection";
import NotificationsSection from "../../components/Dashboard/NotificationsSection/NotificationsSection";

function Dashboard() {
  const stats = [
    { title: "Total Trips", value: "24" },
    { title: "Average Packing Progress", value: "85%" },
    { title: "Upcoming Trips", value: "3" },
  ];

  return (
    <div className={styles.app}>
      <Header />
      <h2 className={styles.welcome}>Welcome to your suitcase, !</h2>

      <section className={styles.statsContainer}>
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </section>

      <main className={styles.contentContainer}>
        <TripsSection />
        <NotificationsSection />
      </main>
    </div>
  );
}

export default Dashboard;