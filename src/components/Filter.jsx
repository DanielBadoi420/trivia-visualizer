export function Filter({ categories, selected, onSelect }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label>Filter by Category: </label>
      <select value={selected} onChange={(e) => onSelect(e.target.value)}>
        <option value="All">All</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
