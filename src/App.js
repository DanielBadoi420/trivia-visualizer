import React, { useState, useEffect, useRef } from "react";
import { CategoryChart } from "./components/CategoryChart";
import { DifficultyChart } from "./components/DifficultyChart";
import { Filter } from "./components/Filter";
import './App.css';

export default function App() {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return; 
    fetchedRef.current = true;

    const controller = new AbortController();

    const load = async (retry = 0) => {
      try {
        const res = await fetch(
          "https://opentdb.com/api.php?amount=50&type=multiple",
          { signal: controller.signal }
        );

        if (res.status === 429) {
          if (retry < 2) {             
            const delay = 500 * (retry + 1);
            await new Promise(r => setTimeout(r, delay));
            return load(retry + 1);
          }
          throw new Error("Rate limited (429). Please try again in a moment.");
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json?.results ?? []);
        setError(null);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Fetch failed");
      }
    };

    load();

    return () => controller.abort();
  }, []);
  if (error) {
    return (
      <div style={{ padding: "1rem", color: "crimson" }}>
        <p>Oops: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!data || data.length === 0) {
  return <p style={{ padding: "1rem" }}>Loading...</p>;
  }

  const filteredData =
    selectedCategory === "All"
      ? data
      : data.filter((q) => q.category === selectedCategory);

  const categories = [...new Set(data.map((q) => q.category))];
  console.log("Render — data length:", data ? data.length : "undefined");
  console.log("Selected category:", selectedCategory);

  return (
  <div className="container">
    <h1> Open Trivia Visualizer</h1>
    <Filter
      categories={categories}
      selected={selectedCategory}
      onSelect={setSelectedCategory}
    />
    {data && data.length > 0 ? (
      <>
        <CategoryChart data={filteredData} />
        <DifficultyChart data={filteredData} />
      </>
    ) : (
      <p>Loading or no data...</p>
    )}
  </div>
);}