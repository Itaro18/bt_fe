import Link from "next/link";

export default function PropertyCard({
    name,
    city,
    id,
    status,
}: {
    name: string;
    city: string;
    id: string;
    status: string;
}) {
    return (
        <Link href={`/property/${id}`}>
            <div className="w-full bg-[#2E2633] p-4 rounded-md cursor-pointer hover:bg-red-600 transition flex justify-between">
                <div>
                    <p>{name}</p>
                    <p>{city}</p>
                </div>
                <div>{status}</div>
            </div>
            
        </Link>
    );
}
