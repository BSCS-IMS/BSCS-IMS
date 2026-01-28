"use client";

import { createContext, useContext, useState, useCallback } from "react";
import Loader from "./Loader"; // import the loader component (DOM animation)

const LoaderContext = createContext({
  showLoader: () => {},
  hideLoader: () => {},
});

export function LoaderProvider({ children }) {
  const [loading, setLoading] = useState(false);

  const showLoader = useCallback(() => setLoading(true), []);
  const hideLoader = useCallback(() => setLoading(false), []);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {loading && <Loader />}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  return useContext(LoaderContext);
}
