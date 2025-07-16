"use client";

import { use, useEffect, useState } from "react";
import axios from "@/lib/api/axios";
import { Booking, Property } from "@/types/types";
import BookingCard from "@/components/BookingCard";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { eachDayOfInterval } from "date-fns";

export type resBooking = {
    BookingID: string;
    CustomerID: string;
    PropertyID: string;
    PhoneNo: string;
    AdvancePaid: number;
    TotalAmount: number;
    CheckInDate: string;   // ISO string
    CheckOutDate: string;  // ISO string
    CreatedAt: string;
    UpdatedAt: string;
    City: string;
    Floor: string;
    Handler: string;
    Remarks: string;
    Status: string;
    Through: string;
  
    Customer: {
      CustomerID: string;
      Name: string;
      Phone: string;
    };
  
    Property: {
      PropertyID: string;
      Name: string;
      City: string;
    };
};

type FormatBooking ={

    name:string;
    phNo:string;
    checkIn:Date;
    checkOut:Date;
    through:string;
    city:string;
    property:string;
    handler:string;
    advance:number;
    total:number;
    status:string;
}

export default function PropertyBookingsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [prop, setProp] = useState<Property>();
    const [bookedDates, setBookedDates] = useState<Date[]>([]);
    const [statusFilter, setStatusFilter] = useState<
        "completed" | "not-completed"
    >("not-completed");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get(
                    `/bookings/property/${id}`
                );

                const formatted = res.data.map((b: resBooking) => {
                    const checkIn = new Date(b.CheckInDate);
                    const checkOut = new Date(b.CheckOutDate);

                    return {
                        id:b.BookingID,
                        name: b.Customer?.Name || "Unknown",
                        phNo: b.PhoneNo,
                        checkIn,
                        checkOut,
                        through: b.Through,
                        city: b.City,
                        property: b.Property?.Name || "Unknown",
                        handler: b.Handler,
                        advance: b.AdvancePaid,
                        total: b.TotalAmount,
                        status: b.Status,
                        remarks: b.Remarks
                    };
                });
                formatted.sort((a: Booking, b: Booking) => 
                    a.checkIn.getTime() - b.checkIn.getTime()
                );

                // Generate all booked dates (excluding checkout date)
                const dates: Date[] = [];
                formatted.forEach((b:FormatBooking) => {
                    dates.push(
                        ...eachDayOfInterval({
                            start: b.checkIn,
                            end: new Date(
                                new Date(b.checkOut).getTime() - 86400000
                            ), // exclude checkout
                        })
                    );
                });

                setBookings(formatted);
                setBookedDates(dates);
            } catch (err) {
                console.error("❌ Failed to fetch bookings", err);
            }
        };

        const fetchProperty = async () => {
            try {
                const res = await axios.get(
                    `/properties/${id}`
                );
                setProp(res.data);
            } catch (err) {
                console.error("❌ Failed to fetch property", err);
            }
        };

        fetchProperty();
        fetchBookings();
    }, []);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredBookings = bookings.filter((b) => {
        const checkOut = new Date(b.checkOut);
        checkOut.setHours(0, 0, 0, 0);

        if (statusFilter === "not-completed") return checkOut >= today;
        if (statusFilter === "completed") return checkOut < today;
        return true;
    });

    return (
        <div className="p-6 mb-14">
            <h1 className="text-2xl font-bold mb-2">{prop?.Name}</h1>
            <h4 className="mb-4">{prop?.City}</h4>

            {/* Calendar View */}
            <div className="flex justify-center">
                <DayPicker
                    mode="single"
                    modifiers={{
                        booked: bookedDates,
                    }}
                    modifiersStyles={{
                        booked: {
                            backgroundColor: "rgba(34,197,94,0.4)", // Tailwind green-500 with opacity
                            borderRadius: "4rem",
                        },
                    }}
                />
            </div>

            <div className="flex justify-center gap-4 my-4">
                <button
                    onClick={() => setStatusFilter("not-completed")}
                    className={`px-4 py-1 rounded-full border ${
                        statusFilter === "not-completed"
                            ? "bg-white  text-gray-800"
                            : "bg-grey-600  text-white"
                    }`}
                >
                    Not Completed
                </button>
                <button
                    onClick={() => setStatusFilter("completed")}
                    className={`px-4 py-1 rounded-full border ${
                        statusFilter === "completed"
                            ? "bg-white  text-gray-800"
                            : "bg-grey-600  text-white"
                    }`}
                >
                    Completed
                </button>
            </div>

            {/* Booking List */}
            <div className="mt-6 flex flex-col gap-4">
                {filteredBookings.map((b, idx) => (

                    <BookingCard key={idx} {...b} />
                ))}
            </div>
        </div>
    );
}
