"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

type User = {
     id: string;
     name: string;
     email: string;
     avatarUrl: string | null;
     bio: string;
     role: string;
     timezone: string;
     createdAt: string;
     currentOrganization: string | null;
     currentStatus: string | null;
     socialLinks: any;
     skillsOffered: any[];
     skillsWanted: any[];
};

export default function ConnectionDetailPage() {
     const { id } = useParams();
     const [user, setUser] = useState<User | null>(null);
     const [selectedDate, setSelectedDate] = useState<Date | null>(null);

     const handleSubmitRequest = async () => {
          if (!selectedDate || !user?.id) return;

          const token = localStorage.getItem("token");

          const res = await fetch("http://localhost:4000/api/sessions/request", {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({
                    mentorId: user.id,
                    startTime: selectedDate.toISOString(),
               }),
          });

          const data = await res.json();
          if (res.ok) {
               alert("Session request sent!");
          } else {
               alert(data.message || "Failed to request session");
          }
     };

     useEffect(() => {
          if (!id) return;

          const fetchData = async () => {
               try {
                    const res = await fetch(`http://localhost:4000/api/profile/user/${id}`);
                    const data = await res.json();
                    setUser(data.user);
               } catch (err) {
                    console.error("Failed to fetch user", err);
               }
          };

          fetchData();
     }, [id]);

     if (!user) return <div className="p-6">Loading user details...</div>;

     return (
          <>
               <h2>User Detail Page</h2>
               <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-md mt-10">
                    <div className="flex items-center gap-6 border-b pb-6">
                         <Avatar className="w-24 h-24 ring-2 ring-gray-300 shadow-sm">
                              <AvatarImage src={user.avatarUrl || ""} alt={user.name} />
                              <AvatarFallback className="text-xl">{user.name?.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <div>
                              <h1 className="text-3xl font-semibold">{user.name}</h1>
                              <p className="text-gray-500 mt-1">{user.bio}</p>
                              <Badge variant="secondary" className="mt-2">
                                   {user.role}
                              </Badge>
                         </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-gray-800">
                         <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium">{user.email}</p>
                         </div>
                         <div>
                              <p className="text-sm text-gray-500">Timezone</p>
                              <p className="font-medium">{user.timezone}</p>
                         </div>
                         <div>
                              <p className="text-sm text-gray-500">Joined</p>
                              <p className="font-medium">
                                   {new Date(user.createdAt).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                   })}
                              </p>
                         </div>
                    </div>

                    {user.skillsOffered?.length > 0 && (
                         <div className="mt-10">
                              <h2 className="text-lg font-semibold mb-2">Skills Offered</h2>
                              <div className="flex flex-wrap gap-2">
                                   {user.skillsOffered.map((skill, index) => (
                                        <Badge key={skill.id || index} variant="outline">
                                             {skill.name}
                                        </Badge>
                                   ))}
                              </div>
                         </div>
                    )}

                    {user.skillsWanted?.length > 0 && (
                         <div className="mt-6">
                              <h2 className="text-lg font-semibold mb-2">Skills Wanted</h2>
                              <div className="flex flex-wrap gap-2">
                                   {user.skillsWanted.map((skill, index) => (
                                        <Badge
                                             key={skill.id || index}
                                             variant="outline"
                                             className="bg-yellow-50 border-yellow-300 text-yellow-700"
                                        >
                                             {skill.name}
                                        </Badge>
                                   ))}
                              </div>
                         </div>
                    )}
                    <div style={{ maxWidth: 300, margin: "auto", padding: 20 }}>
                         <label htmlFor="datetime">Pick a date and time:</label>
                         <DatePicker
                              selected={selectedDate}
                              onChange={(date) => setSelectedDate(date)}
                              showTimeSelect
                              timeIntervals={15}
                              dateFormat="yyyy/MM/dd h:mm aa"
                              placeholderText="Click to select date & time"
                              className="border rounded px-3 py-2 w-full"
                         />

                         {selectedDate && (
                              <p className="mt-3 text-sm">Selected: {dayjs(selectedDate).format("YYYY-MM-DD HH:mm")}</p>
                         )}
                    </div>

                    <button
                         className="bg-purple-500 py-2 px-4 rounded-3xl text-white align-middle"
                         onClick={handleSubmitRequest}
                    >
                         Submit
                    </button>
               </div>
          </>
     );
}
