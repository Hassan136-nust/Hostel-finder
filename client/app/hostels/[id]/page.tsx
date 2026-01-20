import React from "react";
import HostelDetailClient from "./HostelDetailsClient";

export async function generateMetadata({ params }: any) {
  const id = params.id;
  
  // Use localhost for server-side fetching as we are in the same environment
  // We need to fetch the hostel content to generate dynamic metadata
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}hostel/${id}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    
    const data = await res.json();
    const hostel = data?.hostel;

    if (!hostel) {
      return {
        title: "Hostel Not Found | HOSTELITE",
        description: "The requested hostel could not be found.",
      };
    }

    return {
      title: `${hostel.name} | HOSTELITE`,
      description: `Check out ${hostel.name} in ${hostel.city}. starting from PKR ${data?.rooms?.[0]?.price || "N/A"}/mo.`,
      openGraph: {
        title: `${hostel.name} | HOSTELITE`,
        description: `${hostel.city} - ${hostel.address}. View amenities, prices, and reviews on HOSTELITE.`,
        images: hostel.images?.[0]?.url ? [hostel.images[0].url] : [],
      },
    };
  } catch (error) {
    console.error("Error fetching hostel for metadata:", error);
    return {
      title: "Hostel Details | HOSTELITE",
      description: "Find the best hostels near you with HOSTELITE.",
    };
  }
}

const Page = () => {
    return <HostelDetailClient />;
};

export default Page;
