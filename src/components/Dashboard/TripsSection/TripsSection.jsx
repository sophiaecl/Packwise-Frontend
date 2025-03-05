import styles from "./TripsSection.module.css";
import TripCard from "../TripCard/TripCard";

function TripsSection() {
  const trips = [
    {
      name: "Paris, France",
      date: "2024-03-15",
      status: "upcoming",
      progress: 65,
    },
    {
      name: "Tokyo, Japan",
      date: "2024-05-20",
      status: "planning",
      progress: 30,
    },
    {
      name: "New York, USA",
      date: "2024-02-28",
      status: "completed",
      progress: 100,
    },
  ];

  return (
    <section className={styles.tripsSection}>
      <div className={styles.tripsHeader}>
        <h2 className={styles.tripsTitle}>Your Trips</h2>
        <button className={styles.newTripButton}>New Trip</button>
      </div>
      {trips.map((trip, index) => (
        <TripCard key={index} {...trip} />
      ))}
    </section>
  );
}

export default TripsSection;
