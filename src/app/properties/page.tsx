// app/properties/page.tsx
"use client";

import AddPropertyDialog from "@/components/PropertyAdder";
import PropeprtyCard from "@/components/ProppertyCard";
import React, { useState, useEffect } from "react";
import axios from "@/lib/api/axios";
import { toast } from "sonner";
import { Property } from "@/types/types";

interface PropertyWithStatus {
    PropertyID: string;
    Status: string; // e.g., "Available", "Confirmed", "Pending"
}

export default function Properties() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [statuses, setStatuses] = useState<Record<string, string>>({});
    const [selectedCities, setSelectedCities] = useState<Set<string>>(
        new Set()
    );

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get(
                    "/properties"
                );
                setProperties(response.data);
            } catch (err) {
                console.error("❌ Failed to fetch properties", err);
                toast.error("Something went wrong fetching properties");
            }
        };

        const fetchStatuses = async () => {
            try {
                const response = await axios.get(
                    "/bookings/properties/today-status"
                );

                const statusMap: Record<string, string> = {};
                response.data.forEach((item: PropertyWithStatus) => {
                    statusMap[item.PropertyID] = item.Status;
                });
                setStatuses(statusMap);
            } catch (err) {
                console.error("❌ Failed to fetch property statuses", err);
                toast.error("Something went wrong fetching statuses");
            }
        };

        fetchProperties();
        fetchStatuses();
    }, []);

    const cities = Array.from(new Set(properties.map((p) => p.City)));

    const toggleCityFilter = (city: string) => {
        setSelectedCities((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(city)) {
                newSet.delete(city);
            } else {
                newSet.add(city);
            }
            return newSet;
        });
    };

    const clearFilters = () => setSelectedCities(new Set());

    const filteredProperties = properties.filter((property) => {
        return selectedCities.size === 0 || selectedCities.has(property.City);
    });

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen gap-y-6 overflow-auto py-10 mb-14">
            <div>
                <AddPropertyDialog />
            </div>
            <div className="w-full overflow-x-auto flex gap-2 px-4 py-2 scrollbar-hide">

                {cities.map((city) => (
                    <button
                        key={city}
                        onClick={() => toggleCityFilter(city)}
                        className={`px-3 py-1 rounded-full border text-sm whitespace-nowrap ${
                            selectedCities.has(city)
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-800 border-gray-300"
                        }`}
                    >
                        {city}
                    </button>
                ))}
                {selectedCities.size > 0 && (
                    <button
                        onClick={clearFilters}
                        className="px-3 py-1 rounded-full border border-red-500 text-red-500 text-sm whitespace-nowrap"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            <div className="w-9/10 flex flex-col gap-4">
                {properties.length === 0 ? (
                    <div className="text-center text-gray-500">
                        No properties available.
                    </div>
                ) : (
                    filteredProperties.map((property) => (
                        <PropeprtyCard
                            key={property.PropertyID}
                            id={property.PropertyID}
                            city={property.City}
                            name={property.Name}
                            status={statuses[property.PropertyID]}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
