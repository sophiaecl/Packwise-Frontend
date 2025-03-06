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
  const [userName, setUserName] = useState("traveler");
  const [trips, setTrips] = useState([]);

  // Fetch dashboard data when component mounts
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard data from the backend using the dashboardService
        const response = await dashboardService.getData();

        // Extract username from welcome message
        const welcomeMessage = response.data.message;
        const extractedName = welcomeMessage.replace("Welcome to your dashboard, ", "").replace("!", "");
        setUserName(extractedName);
        
        // Set trips data
        setTrips(response.data.trips);
        
        // Calculate upcoming trips
        const today = new Date();
        const upcomingTrips = response.data.trips.filter(trip => {
          const startDate = new Date(trip.start_date);
          return startDate > today;
        });
        
        // Update stats based on the fetched trips
        setStats([
          { title: "Total Trips", value: response.data.trips.length.toString() },
          { title: "Average Packing Progress", value: "0%" }, // This would need to be calculated if your API provides packing progress
          { title: "Upcoming Trips", value: upcomingTrips.length.toString() },
        ]);
        
        setLoading(false);
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
        Welcome to your suitcase, {userName || currentUser?.username || "traveler"}!
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
        <TripsSection trips={trips} loading={loading} />
        <NotificationsSection />
      </main>
    </div>
  );
}

export default Dashboard;