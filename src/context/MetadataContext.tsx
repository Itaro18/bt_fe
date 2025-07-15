"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "@/lib/api/axios";

type Metadata = {
  cities: string[];
  cityPropertyMap: Record<string, string[]>;
};

type MetadataContextType = Metadata & { loading: boolean };

const MetadataContext = createContext<MetadataContextType | null>(null);

export const MetadataProvider = ({ children }: { children: React.ReactNode }) => {
  const [metadata, setMetadata] = useState<Metadata>({
    cities: [],
    cityPropertyMap: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await axios.get("/metadata/md"); // adjust path as needed
        setMetadata(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch metadata", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return (
    <MetadataContext.Provider value={{ ...metadata, loading }}>
      {children}
    </MetadataContext.Provider>
  );
};

export const useMetadata = (): MetadataContextType => {
  const context = useContext(MetadataContext);
  if (!context) {
    throw new Error("useMetadata must be used within a MetadataProvider");
  }
  return context;
};
