import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Details from "./Details";
import React from "react";
import { createRoot } from "react-dom/client";
import SearchParams from "./SearchParams";
import AdoptedPetContext from "./AdoptedPetContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queries: {
        staleTime: Infinity,
        cacheTime: Infinity,
      },
    },
  },
});

const App = () => {
  const adoptedPet = useState(null);
  return (
    <div>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AdoptedPetContext.Provider value={adoptedPet}>
            <header>
              <Link to="/">Adopt Me!</Link>
            </header>
            <Routes>
              <Route path="/details/:id" element={<Details />} />
              <Route path="/" element={<SearchParams />} />
            </Routes>
          </AdoptedPetContext.Provider>
        </QueryClientProvider>
      </BrowserRouter>
    </div>
  );
};
let root;
if (!root) {
  const container = document.getElementById("root");
  root = createRoot(container);
}

root.render(<App />);
