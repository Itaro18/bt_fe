"use client";

import { useEffect, useState } from "react";
import BookingCard from "@/components/BookingCard";
import { CompactDatePicker } from "./CompactDatePicker";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    users,
    through,
    bookingStatus
} from "@/lib/constants";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Booking } from "@/types/types";
import axios from "@/lib/api/axios";
import { toast } from "sonner";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Filter } from "lucide-react";
import { useMetadata } from "@/context/MetadataContext";
import { getErrorMessage } from "@/lib/utils/parse-error";

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
  

export default function DashboardPage() {
    const { cities, cityPropertyMap } = useMetadata();
    
    const [newBooking, setNewBooking] = useState({
        name: "",
        phNo: "",
        checkIn: "",
        checkOut: "",
        property: "",
        city: cities[0],
        handler: users[0],
        through: through[0],
        advance: "",
        total: "",
        status: bookingStatus[0],
    });
    

    const [bookings, setBookings] = useState<Booking[]>([]); // Ideally define a proper Booking type
    const [open, setOpen] = useState(false);
    const [handlerFilter, setHandlerFilter] = useState<string>("all");
    const [cityFilter, setCityFilter] = useState("all");
    //const [selectedDate, setSelectedDate] = useState<string>(""); // YYYY-MM-DD
    const [filterDate, setFilterDate] = useState<Date | null>(null);

    const fetchBookings = async () => {
        try {
            const res = await axios.get("/bookings");
            console.log(res.data)
            const formattedBookings = res.data.map((b: resBooking) => ({
                id:b.BookingID,
                name: b.Customer?.Name || "Unknown",
                phNo: b.PhoneNo,
                checkIn: new Date(b.CheckInDate),
                checkOut: new Date(b.CheckOutDate),
                through: b.Through,
                city: b.City,
                property: b.Property?.Name || "Unknown",
                handler: b.Handler,
                advance: b.AdvancePaid,
                total: b.TotalAmount,
                status: b.Status,
            }));
            formattedBookings.sort((a: Booking, b: Booking) => 
                a.checkIn.getTime() - b.checkIn.getTime()
            );
            setBookings(formattedBookings);
        } catch (err) {
            console.error("❌ Error fetching bookings:", err);
            toast.error("Something went wrong");
        }
    };
    useEffect(() => {
        fetchBookings();
    }, []);

    // if (loading || cities.length === 0 || !cityPropertyMap[cities[0]]) {
    //     return (
    //       <div className="w-full h-screen flex items-center justify-center">
    //         <p className="text-gray-600">Loading dashboard...</p>
    //       </div>
    //     );
    //   }
    const handleAddBooking = async () => {
        if (
            !newBooking.name.trim() ||
            !newBooking.phNo.trim() ||
            !newBooking.checkIn ||
            !newBooking.checkOut ||
            !newBooking.property.trim() ||
            !newBooking.city ||
            !newBooking.handler ||
            !newBooking.through ||
            !newBooking.advance ||
            !newBooking.total
        ) {
            toast.error(
                "❌ Please fill out all fields correctly before submitting."
            );
            return;
        }

        if (!/^\d{10}$/.test(newBooking.phNo.trim())) {
            toast.error("❌ Phone number must be a valid 10-digit number.");
            return;
        }

        if (new Date(newBooking.checkIn) >= new Date(newBooking.checkOut)) {
            toast.error("❌ Check-out date must be after check-in date.");
            return;
        }

        try {
            const formattedBooking: FormatBooking = {
                name: newBooking.name,
                phNo: newBooking.phNo,
                checkIn: new Date(newBooking.checkIn),
                checkOut: new Date(newBooking.checkOut),
                property: newBooking.property,
                city: newBooking.city,
                handler: newBooking.handler,
                through: newBooking.through,
                advance: Number(newBooking.advance),
                total: Number(newBooking.total),
                status: newBooking.status,
            };

            await axios.post("/bookings/createbooking", {
                ...formattedBooking,
                floor: "NA",
                remarks: "NA",
            });

            setNewBooking({
                name: "",
                phNo: "",
                checkIn: "",
                checkOut: "",
                property: "",
                city: cities[0],
                handler: users[0],
                through: through[0],
                advance: "",
                total: "",
                status: bookingStatus[0],
            });

            setOpen(false); // ✅ Close dialog
            await fetchBookings(); // ✅ Reload bookings
            toast.success("✅ Booking created successfully");
        } catch (err) {
            const msg = getErrorMessage(err);
            console.error("❌ Failed to create booking:", msg);
            toast.error(`❌ ${msg}`);
          }
    };

    const filteredBookings = bookings.filter((b) => {

        if (b.status === "Checked-Out") return false;
        const matchHandler =
            handlerFilter === "all" || b.handler === handlerFilter;
        const matchCity = cityFilter === "all" || b.city === cityFilter;

        
        let matchDate = true;
        if (filterDate) {
            const targetDate = new Date(filterDate);
            targetDate.setHours(0, 0, 0, 0);
            const checkIn = new Date(b.checkIn);
            const checkOut = new Date(b.checkOut);
            checkIn.setHours(0, 0, 0, 0);
            checkOut.setHours(0, 0, 0, 0);
            matchDate = checkIn <= targetDate && targetDate < checkOut;

        }

        return matchHandler && matchCity && matchDate;
    });

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen gap-y-6 py-4 overflow-auto mb-14">
            <div className="sticky top-0 flex items-center gap-x-6 w-full justify-center ">
                <CompactDatePicker date={filterDate} onChange={setFilterDate} />
                {/* <div className="flex items-center gap-x-2">
                    <CalendarDays className="w-5 h-5 text-gray-700" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    />
                </div> */}
                <Select
                    value={cityFilter}
                    onValueChange={(val) => setCityFilter(val)}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                                {city}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-52">
                        <Label className="mb-2 block">Filter by Handler</Label>
                        <Select
                            value={handlerFilter}
                            onValueChange={(val) => setHandlerFilter(val)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select handler" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {users.map((user) => (
                                    <SelectItem key={user} value={user}>
                                        {user}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex items-center gap-2">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-2xl">+ New Booking</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Add New Booking</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {/* Name */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    className="col-span-3"
                                    value={newBooking.name}
                                    onChange={(e) =>
                                        setNewBooking({
                                            ...newBooking,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Phone */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phNo">Phone</Label>
                                <Input
                                    id="phNo"
                                    className="col-span-3"
                                    value={newBooking.phNo}
                                    onChange={(e) =>
                                        setNewBooking({
                                            ...newBooking,
                                            phNo: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Check-in & Check-out */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="checkIn">Check-In</Label>
                                <Input
                                    id="checkIn"
                                    type="date"
                                    className="col-span-3"
                                    value={newBooking.checkIn}
                                    onChange={(e) =>
                                        setNewBooking({
                                            ...newBooking,
                                            checkIn: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="checkOut">Check-Out</Label>
                                <Input
                                    id="checkOut"
                                    type="date"
                                    className="col-span-3"
                                    value={newBooking.checkOut}
                                    onChange={(e) =>
                                        setNewBooking({
                                            ...newBooking,
                                            checkOut: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* City Dropdown */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="city">City</Label>
                                <div className="col-span-3">
                                    <Select
                                        value={newBooking.city}
                                        onValueChange={(val) =>
                                            setNewBooking({
                                                ...newBooking,
                                                city: val,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select city" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cities.map((city) => (
                                                <SelectItem
                                                    key={city}
                                                    value={city}
                                                >
                                                    {city}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Property */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="property">Property</Label>
                                <div className="col-span-3">
                                    <Select
                                        value={newBooking.property}
                                        onValueChange={(val) =>
                                            setNewBooking({
                                                ...newBooking,
                                                property: val,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Property" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cityPropertyMap[
                                                newBooking.city
                                            ]?.map((property) => (
                                                <SelectItem
                                                    key={property}
                                                    value={property}
                                                >
                                                    {property}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Status Dropdown */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status">Status</Label>
                                <div className="col-span-3">
                                    <Select
                                        value={newBooking.status}
                                        onValueChange={(val) =>
                                            setNewBooking({
                                                ...newBooking,
                                                status: val,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {bookingStatus.map((status) => (
                                                <SelectItem
                                                    key={status}
                                                    value={status}
                                                >
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Through Dropdown */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="through">Through</Label>
                                <div className="col-span-3">
                                    <Select
                                        value={newBooking.through}
                                        onValueChange={(val) =>
                                            setNewBooking({
                                                ...newBooking,
                                                through: val,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select source" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {through.map((opt) => (
                                                <SelectItem
                                                    key={opt}
                                                    value={opt}
                                                >
                                                    {opt}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Handler Dropdown */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="handler">Handler</Label>
                                <div className="col-span-3">
                                    <Select
                                        value={newBooking.handler}
                                        onValueChange={(val) =>
                                            setNewBooking({
                                                ...newBooking,
                                                handler: val,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select handler" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map((user) => (
                                                <SelectItem
                                                    key={user}
                                                    value={user}
                                                >
                                                    {user}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Advance */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="advance">Advance</Label>
                                <Input
                                    id="advance"
                                    type="number"
                                    className="col-span-3"
                                    value={newBooking.advance}
                                    onChange={(e) =>
                                        setNewBooking({
                                            ...newBooking,
                                            advance: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Total */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="total">Total</Label>
                                <Input
                                    id="total"
                                    type="number"
                                    className="col-span-3"
                                    value={newBooking.total}
                                    onChange={(e) =>
                                        setNewBooking({
                                            ...newBooking,
                                            total: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddBooking}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="w-9/10 flex flex-col gap-y-6">
                {filteredBookings.map((b, idx) => (
                    <BookingCard
                        key={idx}
                        {...b}
                        phNo={b.phNo}
                        checkIn={new Date(b.checkIn)}
                        checkOut={new Date(b.checkOut)}
                        advance={Number(b.advance)}
                        total={Number(b.total)}
                    />
                ))}
            </div>
        </div>
    );
}
