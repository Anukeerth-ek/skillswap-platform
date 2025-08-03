"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const getDepartmentColor = (department: string) => {
  const map: Record<string, string> = {
    Management: "bg-orange-100 text-orange-800",
    Office: "bg-blue-100 text-blue-800",
    Development: "bg-cyan-100 text-cyan-800",
    Marketing: "bg-pink-100 text-pink-800",
    "Sales & Business": "bg-green-100 text-green-800",
  };
  return map[department] || "bg-gray-100 text-gray-800";
};

type Connection = {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  phoneNumber: string;
  email: string;
  avatar?: string;
};

export default function ConnectionDetailPage() {
  const { id } = useParams();
  const [connection, setConnection] = useState<Connection | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/connections/single/${id}`);
        const data = await res.json();
        setConnection(data);
      } catch (err) {
        console.error("Failed to fetch connection", err);
      }
    };

    fetchData();
  }, [id]);

  if (!connection) {
    return <div className="p-6">Loading connection details...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex items-center gap-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src={connection.avatar} alt={connection.name} />
          <AvatarFallback>{connection.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{connection.name}</h1>
          <p className="text-gray-600">{connection.jobTitle}</p>
          <Badge className={getDepartmentColor(connection.department)}>
            {connection.department}
          </Badge>
        </div>
      </div>

      <div className="mt-8 space-y-3 text-gray-800">
        <p>
          <strong>Email:</strong> {connection.email}
        </p>
        <p>
          <strong>Phone:</strong> {connection.phoneNumber}
        </p>
      </div>
    </div>
  );
}
