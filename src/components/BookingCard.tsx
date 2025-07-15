import { Booking } from "@/types/types";
import Link from "next/link";

export default function BookingCard({
  id,
  name,
  phNo,
  checkIn,
  checkOut,
  through,
  city,
  property,
  handler,
  advance,
  total,
  status,
}: Booking) {
  return (
    <Link href={`/booking/${id}`}>
      <div className="w-full bg-[#2E2633] p-4 rounded-sm cursor-pointer hover:bg-red-600 transition">
        <div className="flex justify-between gap-1">
          <p>{checkIn.toLocaleDateString("en-GB", { day: "numeric", month: "numeric" })}</p>
          <p>{checkOut.toLocaleDateString("en-GB", { day: "numeric", month: "numeric" })}</p>
        </div>
        <div className="flex justify-between">
          <div>
            <p>{name}</p>
            <p>{phNo}</p>
            <p>{through}</p>
            <p>{total}</p>
          </div>
          <div className="text-right">
            <p>{property}</p>
            <p>{city}</p>
            <p>{handler}</p>
            <p>{advance}</p>
          </div>
        </div>
        <div className="flex justify-center">{status}</div>
      </div>
    </Link>
  );
}
