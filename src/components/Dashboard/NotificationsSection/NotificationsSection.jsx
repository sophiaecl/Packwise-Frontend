import { useState, useEffect } from "react";
import styles from "./NotificationsSection.module.css";
import NotificationCard from "../NotificationCard/NotificationCard";
import { tripService, packingService } from "../../../services/api";

function NotificationsSection() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateNotifications = async () => {
      try {
        setLoading(true);
        
        // Fetch user's trips from the dashboard
        const dashboardResponse = await tripService.getTrips();
        const trips = dashboardResponse.data.trips || [];
        
        const today = new Date();
        const generatedNotifications = [];
        
        // Generate notifications for upcoming trips
        trips.forEach(trip => {
          const startDate = new Date(trip.start_date.replace(/\//g, '-'));
          const daysUntil = Math.round((startDate - today) / (1000 * 60 * 60 * 24));
          
          // Notification for trips that are 7 days away
          if (daysUntil > 0 && daysUntil <= 7) {
            generatedNotifications.push({
              icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8V12L15 15M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke="#A8707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
              text: `Your trip to ${trip.city}, ${trip.country} is in ${daysUntil} day${daysUntil === 1 ? '' : 's'}! Start packing soon.`,
              id: `upcoming-${trip.trip_id}`
            });
          }
          
          // Notification for trips that are tomorrow
          if (daysUntil === 1) {
            generatedNotifications.push({
              icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.663 17H14.336M12 3V4M18.364 5.636L17.657 6.343M21 12H20M4 12H3M6.343 6.343L5.636 5.636M8.464 15.536C7.76487 14.8367 7.2888 13.9458 7.09598 12.9759C6.90316 12.006 7.00225 11.0008 7.38073 10.0872C7.75921 9.17366 8.40007 8.39284 9.22229 7.84349C10.0445 7.29414 11.0111 7.00093 12 7.00093C12.9889 7.00093 13.9555 7.29414 14.7777 7.84349C15.5999 8.39284 16.2408 9.17366 16.6193 10.0872C16.9977 11.0008 17.0968 12.006 16.904 12.9759C16.7112 13.9458 16.2351 14.8367 15.536 15.536L14.988 16.083C14.6747 16.3963 14.4262 16.7683 14.2567 17.1777C14.0872 17.5871 13.9999 18.0259 14 18.469V19C14 19.5304 13.7893 20.0391 13.4142 20.4142C13.0391 20.7893 12.5304 21 12 21C11.4696 21 10.9609 20.7893 10.5858 20.4142C10.2107 20.0391 10 19.5304 10 19V18.469C10 17.574 9.644 16.715 9.012 16.083L8.464 15.536Z" stroke="#A8707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
              text: `Your trip to ${trip.city}, ${trip.country} is tomorrow! Time to finish packing.`,
              id: `tomorrow-${trip.trip_id}`,
              priority: 'high'
            });
          }
          
          // Notification for trips that are within 3 days
          if (daysUntil > 1 && daysUntil <= 3) {
            // Try to check if they have a packing list
            generatedNotifications.push({
              icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 5H21M11 9H21M11 13H21M11 17H21M5 19L7 21L9 17M7 5V13" stroke="#A8707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
              text: `Don't forget to complete your packing list for ${trip.city}, ${trip.country}!`,
              id: `packing-${trip.trip_id}`
            });
          }
          
          // Notification for trips that are ongoing
          const endDate = new Date(trip.end_date.replace(/\//g, '-'));
          if (today >= startDate && today <= endDate) {
            generatedNotifications.push({
              icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1113.314 0z" stroke="#A8707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="#A8707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
              text: `Enjoy your trip to ${trip.city}, ${trip.country}! We hope you packed everything you need.`,
              id: `ongoing-${trip.trip_id}`
            });
          }
        });
        
        // Try to fetch recently created packing lists
        try {
          // We'll check for trips that might have recently created packing lists
          for (const trip of trips) {
            try {
              const packingListsResponse = await packingService.getPackingLists(trip.trip_id);
              if (packingListsResponse.data?.packing_lists?.length > 0) {
                // Get the most recent packing list details if needed
                const mostRecentListId = packingListsResponse.data.packing_lists[0].list_id;
                
                // Add notification for recently created packing list
                generatedNotifications.push({
                  icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="#A8707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
                  text: `You've created a packing list for ${trip.city}, ${trip.country}! Get packing!`,
                  id: `list-created-${mostRecentListId}`
                });
                
                // Check packing progress
                try {
                  const progressResponse = await packingService.getTripPackingProgress(trip.trip_id);
                  if (progressResponse.data && progressResponse.data.progress < 50) {
                    generatedNotifications.push({
                      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="#A8707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
                      text: `Your packing list for ${trip.city} is only ${Math.round(progressResponse.data.progress)}% complete!`,
                      id: `progress-low-${trip.trip_id}`
                    });
                  }
                } catch (error) {
                  console.warn("Could not fetch packing progress:", error);
                }
              }
            } catch (error) {
              console.warn("Could not fetch packing lists for trip:", error);
            }
          }
        } catch (error) {
          console.warn("Error fetching packing lists:", error);
        }
        
        // Add weather-related notifications (could be connected to a real API in production)
        trips.forEach(trip => {
          const startDate = new Date(trip.start_date.replace(/\//g, '-'));
          const daysUntil = Math.round((startDate - today) / (1000 * 60 * 60 * 24));
          
          if (daysUntil > 0 && daysUntil <= 7) {
            // Random weather notifications for demonstration
            const weatherConditions = [
              "rainy", "sunny", "cold", "hot", "snowy", "windy"
            ];
            const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
            
            let weatherText = "";
            let weatherIcon = "";
            
            switch(randomCondition) {
              case "rainy":
                weatherText = `Rainy weather expected for your ${trip.city} trip. Pack an umbrella!`;
                weatherIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 13v8M8 13v8M12 15v8M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25" stroke="#A8707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
                break;
              case "sunny":
                weatherText = `Sunny weather expected for your ${trip.city} trip. Don't forget sunscreen!`;
                weatherIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v1M3 12h1m8-9a8 8 0 018 8c0 4.97-3 12-8 12s-8-7.03-8-12a8 8 0 018-8zm5.657 2.343l.707.707M5.636 5.636l.707.707M21 12h-1M4 16h16" stroke="#A8707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
                break;
              case "cold":
                weatherText = `Cold temperatures expected for your ${trip.city} trip. Pack warm clothes!`;
                weatherIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12h1M14.5 4.5l3 3M20 12h1M14.5 19.5l3-3M4.5 19.5l3-3M4.5 4.5l3 3M12 2v1m0 18v1m-5-11a5 5 0 1110 0c0 1.677-1.632 2.265-3.5 2.5-.442.058-.5.25-.5.5s.058.442.5.5c1.868.236 3.5.824 3.5 2.5a5 5 0 11-10 0c0-1.677 1.632-2.265 3.5-2.5.442-.058.5-.25.5-.5s-.058-.442-.5-.5c-1.868-.236-3.5-.824-3.5-2.5z" stroke="#A8707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
                break;
              case "hot":
                weatherText = `Hot temperatures expected for your ${trip.city} trip. Pack light clothing!`;
                weatherIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.827 15.87a4 4 0 11-5.654 0M12 9V3m0 0L9 6m3-3l3 3" stroke="#A8707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
                break;
              case "snowy":
                weatherText = `Snow expected for your ${trip.city} trip. Pack winter gear!`;
                weatherIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25M8 16h.01M8 20h.01M12 18h.01M12 22h.01M16 16h.01M16 20h.01" stroke="#A8707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
                break;
              case "windy":
                weatherText = `Windy conditions expected for your ${trip.city} trip. Pack accordingly!`;
                weatherIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" stroke="#A8707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
                break;
            }
            
            generatedNotifications.push({
              icon: weatherIcon,
              text: weatherText,
              id: `weather-${trip.trip_id}`
            });
          }
        });
        
        // Limit the number of notifications to show
        const limitedNotifications = generatedNotifications
          .sort((a, b) => (b.priority === 'high' ? 1 : 0) - (a.priority === 'high' ? 1 : 0))
          .slice(0, 5);
        
        setNotifications(limitedNotifications);
      } catch (error) {
        console.error("Error generating notifications:", error);
        // Fallback to default notifications if there's an error
        setNotifications([
          {
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.663 17H14.336M12 3V4M18.364 5.636L17.657 6.343M21 12H20M4 12H3M6.343 6.343L5.636 5.636M8.464 15.536C7.76487 14.8367 7.2888 13.9458 7.09598 12.9759C6.90316 12.006 7.00225 11.0008 7.38073 10.0872C7.75921 9.17366 8.40007 8.39284 9.22229 7.84349C10.0445 7.29414 11.0111 7.00093 12 7.00093C12.9889 7.00093 13.9555 7.29414 14.7777 7.84349C15.5999 8.39284 16.2408 9.17366 16.6193 10.0872C16.9977 11.0008 17.0968 12.006 16.904 12.9759C16.7112 13.9458 16.2351 14.8367 15.536 15.536L14.988 16.083C14.6747 16.3963 14.4262 16.7683 14.2567 17.1777C14.0872 17.5871 13.9999 18.0259 14 18.469V19C14 19.5304 13.7893 20.0391 13.4142 20.4142C13.0391 20.7893 12.5304 21 12 21C11.4696 21 10.9609 20.7893 10.5858 20.4142C10.2107 20.0391 10 19.5304 10 19V18.469C10 17.574 9.644 16.715 9.012 16.083L8.464 15.536Z" stroke="#A8707D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
            text: "Welcome to PackWise! Create your first trip to get started."
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    generateNotifications();
  }, []);

  return (
    <section className={styles.notificationsSection}>
      <h2 className={styles.notificationsTitle}>Notifications</h2>
      {loading ? (
        <div className={styles.loadingNotifications}>Loading your notifications...</div>
      ) : notifications.length === 0 ? (
        <div className={styles.emptyNotifications}>No notifications at the moment</div>
      ) : (
        notifications.map((notification, index) => (
          <NotificationCard key={notification.id || index} {...notification} />
        ))
      )}
    </section>
  );
}

export default NotificationsSection;
