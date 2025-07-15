"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/api/axios";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { users, bookingStatus, through } from "@/lib/constants";
import { useMetadata } from "@/context/MetadataContext";

export type EditableBooking = {
    id: string;
    name: string;
    phNo: string;
    checkIn: Date;
    checkOut: Date;
    through: string;
    city: string;
    property: string;
    handler: string;
    advance: number;
    total: number;
    status: string;
    remarks: string;
};

export default function BookingDetailPage() {
    const { id } = useParams();
    const [booking, setBooking] = useState<EditableBooking | null>(null);
    const { cities, cityPropertyMap } = useMetadata();

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await axios.get(`/bookings/${id}`);
                const data = res.data;
                setBooking({
                    id: data.BookingID,
                    name: data.Customer?.Name || "Unknown",
                    phNo: data.PhoneNo,
                    checkIn: new Date(data.CheckInDate),
                    checkOut: new Date(data.CheckOutDate),
                    through: data.Through,
                    city: data.City,
                    property: data.Property?.Name || "Unknown",
                    handler: data.Handler,
                    advance: data.AdvancePaid,
                    total: data.TotalAmount,
                    status: data.Status,
                    remarks: data.Remarks || "",
                });
            } catch (err) {
                console.error("❌ Failed to fetch booking", err);
                toast.error("Failed to load booking.");
            }
        };

        fetchBooking();
    }, [id]);

    const handleUpdate = async () => {
        if (!booking) return;

        // ✅ Validation
        const errors: string[] = [];
        if (!booking.name.trim()) errors.push("Name is required");
        if (!/^\d{10}$/.test(booking.phNo.trim()))
            errors.push("Phone number must be 10 digits");
        if (!booking.city) errors.push("City must be selected");
        if (!booking.property) errors.push("Property must be selected");
        if (!booking.handler) errors.push("Handler must be selected");
        if (!booking.through) errors.push("Through must be selected");
        if (booking.advance < 0 || booking.total < 0)
            errors.push("Amounts must be positive");
        if (booking.checkIn >= booking.checkOut)
            errors.push("Check-out must be after Check-in");
        if (errors.length > 0) {
            toast.error(errors.join(", "));
            return;
        }
        try {
            await axios.put(`/bookings/update-booking/${id}`, {
                ...booking,
                checkIn: booking.checkIn.toISOString(),
                checkOut: booking.checkOut.toISOString(),
            });
            toast.success("✅ Booking updated successfully");
        } catch (err) {
            console.error("❌ Update failed", err);
            toast.error("Failed to update booking");
        }
    };

    if (!booking) return <p className="p-6">Loading...</p>;

    return (
        <div className="p-6 max-w-xl mx-auto space-y-4 my-3 mb-10">
            <h1 className="text-xl font-bold">Edit Booking</h1>

            <div className="space-y-2">
                <Label>Name</Label>
                <Input
                    value={booking.name}
                    onChange={(e) =>
                        setBooking({ ...booking, name: e.target.value })
                    }
                />

                <Label>Phone Number</Label>
                <Input
                    value={booking.phNo}
                    onChange={(e) =>
                        setBooking({ ...booking, phNo: e.target.value })
                    }
                />

                <Label>Check-In</Label>
                <Input
                    type="date"
                    value={booking.checkIn.toISOString().split("T")[0]}
                    onChange={(e) =>
                        setBooking({
                            ...booking,
                            checkIn: new Date(e.target.value),
                        })
                    }
                />

                <Label>Check-Out</Label>
                <Input
                    type="date"
                    value={booking.checkOut.toISOString().split("T")[0]}
                    onChange={(e) =>
                        setBooking({
                            ...booking,
                            checkOut: new Date(e.target.value),
                        })
                    }
                />

                <Label>City</Label>
                <Select
                    value={booking.city}
                    onValueChange={(val) =>
                        setBooking({ ...booking, city: val })
                    }
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                        {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                                {city}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Label>Property</Label>
                <Select
                    value={booking.property}
                    onValueChange={(val) =>
                        setBooking({ ...booking, property: val })
                    }
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                        {(cityPropertyMap[booking.city] || []).map((prop) => (
                            <SelectItem key={prop} value={prop}>
                                {prop}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Label>Handler</Label>
                <Select
                    value={booking.handler}
                    onValueChange={(val) =>
                        setBooking({ ...booking, handler: val })
                    }
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select handler" />
                    </SelectTrigger>
                    <SelectContent>
                        {users.map((user) => (
                            <SelectItem key={user} value={user}>
                                {user}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Label>Through</Label>
                <Select
                    value={booking.through}
                    onValueChange={(val) =>
                        setBooking({ ...booking, through: val })
                    }
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                        {through.map((t) => (
                            <SelectItem key={t} value={t}>
                                {t}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Label>Status</Label>
                <Select
                    value={booking.status}
                    onValueChange={(val) =>
                        setBooking({ ...booking, status: val })
                    }
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        {bookingStatus.map((status) => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Label>Advance</Label>
                <Input
                    type="number"
                    value={booking.advance}
                    onChange={(e) =>
                        setBooking({
                            ...booking,
                            advance: Number(e.target.value),
                        })
                    }
                />

                <Label>Total</Label>
                <Input
                    type="number"
                    value={booking.total}
                    onChange={(e) =>
                        setBooking({
                            ...booking,
                            total: Number(e.target.value),
                        })
                    }
                />

                <Label>Remarks</Label>
                <Textarea
                    value={booking.remarks}
                    onChange={(e) =>
                        setBooking({ ...booking, remarks: e.target.value })
                    }
                />
            </div>

            <div className="flex justify-between px-6">

            <Button onClick={handleUpdate} className="mt-4">
                Update
            </Button>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="destructive" className="mt-4 ">
                        Delete Booking
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this booking?</p>
                    <DialogFooter className="mt-4">
                        <Button variant="ghost">Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                try {
                                    await axios.delete(
                                        `/bookings/delete/${booking.id}`
                                    );
                                    toast.success("Booking deleted");
                                    window.location.href = "/dashboard"; // ✅ navigate to dashboard
                                } catch (err) {
                                    console.error(
                                        "❌ Failed to delete booking",
                                        err
                                    );
                                    toast.error("Failed to delete booking");
                                }
                            }}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </div>
        </div>
    );
}
