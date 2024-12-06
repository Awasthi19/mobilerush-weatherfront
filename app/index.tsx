import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  ImageBackground,
  Image,
} from "react-native";
import { Title, Avatar } from "react-native-paper";
import { Svg, Rect, Text as SvgText } from "react-native-svg";

export default function WeatherPage() {
  interface WeatherData {
    weather: {
      temperature: number;
      feels_like: number;
      condition: string;
      precipitation_probability: number;
      wind_speed: number;
      atm_pressure: number;
      humidity: number;
      risk_factor: number;
    };
    location: {
      city: string;
    };
  }

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const recommendedPlaces = [
    {
      name: "Kathmandu",
      distance: "15 KM",
      description: "City full of temples and monkeys",
      image: require("@/assets/images/kathmandu.jpg"),
    },
    {
      name: "Chitwan",
      distance: "50 KM",
      description: "Meet the wildlife",
      image: require("@/assets/images/kathmandu.jpg"),
    },
    {
      name: "Pokhara",
      distance: "90 KM",
      description: "Tourist's hub",
      image: require("@/assets/images/kathmandu.jpg"),
    },
    {
      name: "Dhangadhi",
      distance: "185 KM",
      description: "Beauty of Far-West",
      image: require("@/assets/images/kathmandu.jpg"),
    },
  ];

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch("https://mr-api-three.vercel.app/weather");
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#d72638" />
        <Text>Loading Weather Data...</Text>
      </View>
    );
  }

  if (!weatherData) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Failed to load weather data. Please try again later.</Text>
      </View>
    );
  }

  const {
    temperature,
    feels_like,
    condition,
    precipitation_probability,
    wind_speed,
    atm_pressure,
    humidity,
    risk_factor,
  } = weatherData.weather;
  const { city } = weatherData.location;

  // Map weather conditions to images
  const conditionImages: { [key: string]: any } = {
    Sunny: require("@/assets/images/Sunny.png"),
    Rainy: require("@/assets/images/Rainy.png"),
    Snowy: require("@/assets/images/Snowy.png"),
    Default: require("@/assets/images/default.png"), // Fallback image
  };

  // Get the correct image for the condition
  const backgroundImage = conditionImages[condition] || conditionImages.Default;

  // Determine sunscreen recommendation based on risk_factor
  const sunscreenRecommendation =
    risk_factor >= 4
      ? "High Risk: Apply Sunscreen!"
      : risk_factor >= 2
      ? "Moderate Risk: Sunscreen Recommended"
      : "Low Risk: No Need for Sunscreen";

  // Bar Chart Data
  const chartData = [
    { day: "Sun", level: "Low", height: 40, color: "#D3D3D3" },
    { day: "Mon", level: "Medium", height: 90, color: "#D3D3D3" },
    { day: "Tue", level: "Low", height: 60, color: "#D3D3D3" },
    { day: "Wed", level: "Medium", height: 90, color: "#D3D3D3" },
    { day: "Thu", level: "Medium", height: 90, color: "#D3D3D3" },
    { day: "Fri", level: "High", height: 120, color: "#007BFF" },
    { day: "Sat", level: "Heavy", height: 130, color: "#FF1493" },
  ];

  const renderBarChart = () => {
    return (
      <Svg height="200" width="350" style={styles.chart}>
        {chartData.map((item, index) => (
          <React.Fragment key={index}>
            <Rect
              x={index * 45 + 20}
              y={200 - item.height}
              width="30"
              height={item.height}
              fill={item.color}
              rx="5"
            />
            <SvgText
              x={index * 45 + 35}
              y="190"
              fontSize="12"
              fill="black"
              textAnchor="middle"
            >
              {item.day}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    );
  };

  return (
    <ImageBackground
      source={require("@/assets/images/christmas.jpg")}
      style={{ flex: 1 }}
    >
    <ScrollView style={styles.container}>
      {/* Weather Section */}
      <ImageBackground
        source={backgroundImage}
        style={styles.header}
        resizeMode="cover"
      >
        <Text style={styles.temperature}>{temperature}°C</Text>
        <Text style={styles.weatherInfo}>{condition}</Text>
        <Text style={styles.date}>{city}</Text>
        <Text style={styles.feelsLike}>Feels Like {feels_like}°C</Text>
      </ImageBackground>

      {/* Weather Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailBox}>
          <Avatar.Icon size={48} icon="weather-pouring" />
          <Text style={styles.detailText}>
            {precipitation_probability}% Precipitation
          </Text>
        </View>
        <View style={styles.detailBox}>
          <Avatar.Icon size={48} icon="weather-windy" />
          <Text style={styles.detailText}>{wind_speed} km/hr Wind</Text>
        </View>
        <View style={styles.detailBox}>
          <Avatar.Icon size={48} icon="gauge" />
          <Text style={styles.detailText}>{atm_pressure} mm Atm Pressure</Text>
        </View>
        <View style={styles.detailBox}>
          <Avatar.Icon size={48} icon="water" />
          <Text style={styles.detailText}>{humidity}% Humidity</Text>
        </View>
      </View>

      {/* Apply Sunscreen Section */}
      <Text style={styles.sunscreenText}>{sunscreenRecommendation}</Text>

      {/* Recommended Places */}
      <Title style={styles.sectionTitle}>Recommended Places</Title>
      {recommendedPlaces.map((place, index) => (
        <View key={index} style={styles.placeContainer}>
          <Image source={place.image} style={styles.placeImage} />
          <View style={styles.placeDetails}>
            <Text style={styles.placeName}>{place.name}</Text>
            <Text style={styles.placeDistance}>{place.distance}</Text>
            <Text style={styles.placeDescription}>{place.description}</Text>
          </View>
        </View>
      ))}

      {/* Rain Chart */}
      <Title style={styles.sectionTitle}>Chances of Rain</Title>
      <View style={styles.chartContainer}>{renderBarChart()}</View>
    </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,

  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#d72638",
    borderTopLeftRadius: 20, // Rounded corners on the top-left
    borderTopRightRadius: 20, // Rounded corners on the top-right
    overflow: "hidden",
  },
  temperature: {
    fontSize: 60,
    color: "#fff",
    fontWeight: "bold",
  },
  weatherInfo: {
    fontSize: 24,
    color: "#fff",
  },
  date: {
    fontSize: 16,
    color: "#fff",
  },
  feelsLike: {
    fontSize: 16,
    color: "#fff",
  },
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping items into multiple rows
    padding: 8, // Padding inside the container
    backgroundColor: "#e1e0de", // Background for the entire container
    borderRadius: 20, // Rounded corners
    shadowColor: "#000", // Shadow for elevation effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, // Elevation for Android
    marginBottom: 10, // Spacing around the container
    marginTop: -10,
  },
  detailBox: {
    width: "45%", // Width to make two items per row
    marginBottom: 8, // Spacing between rows
    alignItems: "center", // Center the content
    padding: 1, // Inner padding for detail boxes
    borderRadius: 16, // Rounded corners for individual boxes
  },
  detailText: {
    marginTop: 8,
    textAlign: "center",
    color: "#333", // Dark text for readability
    fontSize: 12,
    fontWeight: "500",
  },
  
  sunscreenText: {
    textAlign: "center",
    fontSize: 18,
    color: "#d72638",
    marginVertical: 10,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    marginVertical: 10,
    paddingHorizontal: 16,
    color: "#2a2a2a",
  },
  placeContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  placeImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  placeDetails: {
    marginLeft: 10,
    flex: 1,
  },
  placeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeDistance: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  placeDescription: {
    fontSize: 14,
    color: "#777",
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  chart: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    paddingVertical: 20,
  },
});
