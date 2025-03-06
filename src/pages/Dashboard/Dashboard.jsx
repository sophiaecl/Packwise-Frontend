import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import Header from "../../components/Dashboard/Header/Header";
import StatsCard from "../../components/Dashboard/StatsCard/StatsCard";
import TripsSection from "../../components/Dashboard/TripsSection/TripsSection";
import NotificationsSection from "../../components/Dashboard/NotificationsSection/NotificationsSection";
import { useAuth } from "../../context/auth-context";
import { dashboardService, tripService } from "../../services/api";

function Dashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState([
    { title: "Total Trips", value: "0" },
    { title: "Average Packing Progress", value: "0%" },
    { title: "Upcoming Trips", value: "0" },
  ]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data when component mounts
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // You can uncomment these when your API endpoints are ready
        
        // Fetch dashboard stats
        // const dashboardData = await dashboardService.getData();
        // setStats([
        //   { title: "Total Trips", value: dashboardData.data.totalTrips.toString() },
        //   { title: "Average Packing Progress", value: `${dashboardData.data.avgPackingProgress}%` },
        //   { title: "Upcoming Trips", value: dashboardData.data.upcomingTrips.toString() },
        // ]);
        
        // For now, use mock data
        setTimeout(() => {
          setStats([
            { title: "Total Trips", value: "24" },
            { title: "Average Packing Progress", value: "85%" },
            { title: "Upcoming Trips", value: "3" },
          ]);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className={styles.app}>
      <Header />
      <h2 className={styles.welcome}>
        Welcome to your suitcase, {currentUser?.username || "traveler"}!
      </h2>

      <section className={styles.statsContainer}>
        {loading ? (
          <div>Loading stats...</div>
        ) : (
          stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))
        )}
      </section>

      <main className={styles.contentContainer}>
        <TripsSection />
        <NotificationsSection />
      </main>
    </div>
  );
}

export default Dashboard;