import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

function HomePage() {
  const [data, setData] = useState<string>("Loading...");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${API_URL}/api/use/hey`);
        console.log(response);
        setData(response.data); // Update the state
      } catch (error) {
        setData("Error fetching data");
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []); // Runs once on component mount

  return (
    <div>
      <h1>{data}</h1>
      <h2>asdsa</h2>
    </div>
  );
}

export default HomePage;
