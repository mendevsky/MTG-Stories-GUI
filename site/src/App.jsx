import { useEffect, useState } from "react";
import CollectionCard from "./components/CollectionCard";

export default function App() {
  // State: values React remembers. Calling a setter re-renders the page.
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  // Runs once, after the first render (the empty [] at the end means
  // "no dependencies", so it never runs again).
  useEffect(() => {
    // BASE_URL is "/" in development; it will matter when we deploy to a subpath.
    fetch(`${import.meta.env.BASE_URL}catalog.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => setCollections(data.collections))
      .catch((err) => setError(err.message));
  }, []);

  // Derived data: computed on every render from the state above.
  const normalizedQuery = query.trim().toLowerCase();
  const visibleCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(normalizedQuery)
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold text-center">MTG Stories</h1>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search collections..."
          className="mt-6 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 outline-none focus:border-amber-400"
        />

        {error && (
          <p className="mt-6 text-red-400">Could not load the catalog: {error}</p>
        )}

        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCollections.map((collection) => (
            <CollectionCard key={collection.slug} collection={collection} />
          ))}
        </ul>
      </main>
    </div>
  );
}