"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { User } from "@/types";
import { Button } from "@/components/ui/button";

type Skill = { id: string; name: string };

export default function ConnectionDetailPage() {
     const { id } = useParams();
     const [mentor, setMentor] = useState<User | null>(null);
     const [selectedDate, setSelectedDate] = useState<Date | null>(null);

     const [loggedInUserSkills, setLoggedInUserSkills] = useState<Skill[]>([]);
     const [selectedSkillNames, setSelectedSkillNames] = useState<string | null>(null);
     const [requestLoading, setRequestLoading] = useState(false);
     const [requestStatus, setRequestStatus] = useState(false);
     const handleSubmitRequest = async () => {
          try {
               setRequestLoading(true);
               if (!selectedDate || !mentor?.id || !selectedSkillNames) {
                    alert("Something is missing");
                    return;
               }
               if (requestStatus) {
                    alert("Request already sent");
                    return;
               }
               const token = localStorage.getItem("token");

               const res = await fetch("https://skillswap-platform-ovuw.onrender.com/api/sessions/request", {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                         Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                         startTime: selectedDate.toISOString(),
                         mentorId: mentor.id,
                         selectedSkillNames: selectedSkillNames,
                    }),
               });

               const data = await res.json();
               if (res.ok) {
                    alert("Session request sent!");
                    setRequestStatus(true);
               } else {
                    alert(data.message || "Failed to request session");
               }
          } catch (error) {
               console.error("error: ", error);
          } finally {
               setRequestLoading(false);
          }
     };

     useEffect(() => {
          if (!id) return;

          const fetchData = async () => {
               try {
                    const res = await fetch(`https://skillswap-platform-ovuw.onrender.com/api/profile/user/${id}`);
                    const data = await res.json();
                    setMentor(data.user);
               } catch (err) {
                    console.error("Failed to fetch user", err);
               }
          };

          fetchData();
     }, [id]);
console.log("loggedInUserSkills", loggedInUserSkills)
     useEffect(() => {
          const fetchLoggedInUser = async () => {
               const token = localStorage.getItem("token");
               if (!token) return;

               const res = await fetch("https://skillswap-platform-ovuw.onrender.com/api/profile/me", {
                    headers: { Authorization: `Bearer ${token}` },
               });

               const data = await res.json();
               setLoggedInUserSkills(data.user?.skillsOffered || []);
          };

          fetchLoggedInUser();
     }, []);

     if (!mentor) return <div className="p-6">Loading user details...</div>;

     return (
          <>
               <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-md mt-10">
                    <div className="flex items-center gap-6 border-b pb-6">
                         <Avatar className="w-24 h-24 ring-2 ring-gray-300 shadow-sm">
                              <AvatarImage src={mentor.avatarUrl || ""} alt={mentor.name} />
                              <AvatarFallback className="text-xl">{mentor.name?.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <div>
                              <h1 className="text-3xl font-semibold mb-1.5">{mentor.name}</h1>
                              <div className="flex items-center  gap-1">
                                   <p className="text-sm text-gray-500">I&apos;m a</p>
                                   <p className="text-gray-700 font-medium">{mentor.professionDetails?.title}</p>
                              </div>
                              {/* <Badge variant="secondary" className="mt-2">
                                   {mentor.role}
                              </Badge> */}
                              <div className="flex items-center justify-center gap-1">
                                   <p className="text-sm text-gray-500">Have</p>
                                   <p className="text-gray-700 font-medium">
                                        {mentor?.experienceSummary?.years} years of Experience
                                   </p>
                              </div>
                         </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-gray-800">
                         {/* <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium">{mentor.email}</p>
                         </div> */}
                         <div>
                              <p className="text-sm text-gray-500">Timezone</p>
                              <p className="font-medium">{mentor.timeZone}</p>
                         </div>
                         <div>
                              <p className="text-sm text-gray-500">Works At</p>
                              <p className="font-medium">{mentor?.currentOrganization?.organization}</p>
                         </div>
                         <div>
                              <h2 className="text-sm text-gray-500">About ME</h2>
                              <p className="font-medium">{mentor?.bio}</p>
                         </div>
                         {/* <div>
                              <p className="text-sm text-gray-500">Joined</p>
                              <p className="font-medium">
                                   {new Date(mentor.createdAt).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                   })}
                              </p>
                         </div> */}
                    </div>

                    {mentor.skillsOffered?.length > 0 && (
                         <div className="mt-10">
                              <h2 className="text-lg font-semibold mb-2">Skills Offering</h2>
                              <div className="flex flex-wrap gap-2">
                                   {mentor.skillsOffered.map((skill, index) => (
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

                    {mentor.skillsWanted?.length > 0 && (
                         <div className="mt-6">
                              <h2 className="text-lg font-semibold mb-2">Skills Needed</h2>
                              <div className="flex flex-wrap gap-2">
                                   {mentor.skillsWanted.map((skill, index) => (
                                        <Badge key={skill.id || index} variant="outline">
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

                    {mentor.skillsOffered?.length > 0 && (
                         <div className="mt-6">
                              <label htmlFor="skill" className="block mb-2 font-medium">
                                   Choose the skill you want mentorship on:
                              </label>
                              <select
                                   id="skill"
                                   value={selectedSkillNames || ""}
                                   onChange={(e) => {
                                        const selectedId = e.target.value; // skill.id
                                        const selectedSkill: Skill | undefined = mentor?.skillsOffered?.find(
                                             (skill) => skill.id === selectedId
                                        );
                                        setSelectedSkillNames(selectedSkill?.name ?? null);
                                   }}
                                   className="border px-3 py-2 rounded w-full"
                              >
                                   <option value="" disabled>
                                        Select a skill
                                   </option>
                                   {mentor.skillsOffered.map((skill) => (
                                        <option key={skill.id} value={skill.id}>
                                             {skill.name}
                                        </option>
                                   ))}
                              </select>
                         </div>
                    )}

                    <Button
                         className={`bg-purple-500 py-2 px-4 rounded-3xl text-white align-middle cursor-pointer mt-4 ${
                              requestLoading ? "cursor-not-allowed" : "cursor-pointer"
                         }`}
                         onClick={handleSubmitRequest}
                         disabled={requestLoading || requestStatus}
                    >
                         {requestStatus ? "Already Sent" : requestLoading ? "Submitting..." : "Submit"}
                    </Button>
               </div>
          </>
     );
}
