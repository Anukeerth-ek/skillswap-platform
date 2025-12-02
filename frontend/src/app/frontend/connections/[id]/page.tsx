"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { AlertCircle, Award, Briefcase, Calendar, CheckCircle2, Clock, MapPin, Target } from "lucide-react";
import { User } from "@/types";
import { getBaseUrl } from "@/utils/getBaseUrl";

// type Skill = { id: string; name: string };

export default function ConnectionDetailPage() {
     const { id } = useParams();
     const [mentor, setMentor] = useState<User | null>(null);
     const [selectedDate, setSelectedDate] = useState<Date | null>(null);

     // const [loggedInUserSkills, setLoggedInUserSkills] = useState<Skill[]>([]);
     const [selectedSkillNames, setSelectedSkillNames] = useState<string | null>(null);
     const [requestLoading, setRequestLoading] = useState(false);
     const [requestStatus, setRequestStatus] = useState(false);
     const [errors, setErrors] = useState({ date: false, skill: false });
     const [showSuccess, setShowSuccess] = useState(false);

     const handleSubmitRequest = async () => {
          const newErrors = {
               date: !selectedDate,
               skill: !selectedSkillNames,
          };

          setErrors(newErrors);

          if (newErrors.date || newErrors.skill) {
               return;
          }

          if (requestStatus) {
               alert("Request already sent");
               return;
          }

          try {
               const token = localStorage.getItem("token");
               const params = new URLSearchParams();
               const BASE_URL = getBaseUrl();
               const url = `${BASE_URL}/api/sessions/request?${params.toString()}`;
               
               const res = await fetch(url,{
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                         Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                         startTime: selectedDate?.toISOString(),
                         mentorId: mentor?.id,
                         selectedSkillNames: selectedSkillNames,
                    }),
               });

               const data = await res.json();
               console.log(data)
               if (res.ok) {
                    setRequestStatus(true);
                    setShowSuccess(true);

                    // Hide success message after 3 seconds
                    setTimeout(() => setShowSuccess(false), 3000);
               } else {
                    alert("Failed to request session");
               }
          } catch (error) {
               console.error("error: ", error);
               alert("An error occurred while sending the request");
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

     useEffect(() => {
          const fetchLoggedInUser = async () => {
               const token = localStorage.getItem("token");
               if (!token) return;

               const res = await fetch("https://skillswap-platform-ovuw.onrender.com/api/profile/me", {
                    headers: { Authorization: `Bearer ${token}` },
               });

               const data = await res.json();
               console.log(data)
               // setLoggedInUserSkills(data.user?.skillsOffered || []);
          };

          fetchLoggedInUser();
     }, []);

     if (!mentor) return <div className="p-6">Loading user details...</div>;

     return (
          <>
               <div className="max-w-5xl mx-auto p-6 md:p-8">
                    {/* Success Message */}
                    {showSuccess && (
                         <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                              <p className="text-green-800 font-medium">Mentorship request submitted successfully!</p>
                         </div>
                    )}

                    {/* Main Profile Card */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                         {/* Header Section */}
                         <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 border-b">
                              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                   <Avatar className="w-28 h-28 ring-4 ring-white shadow-xl">
                                        <AvatarImage src={mentor.avatarUrl || ""} alt={mentor.name} />
                                        <AvatarFallback className="text-2xl bg-purple-100 text-purple-700">
                                             {mentor.name?.charAt(0)}
                                        </AvatarFallback>
                                   </Avatar>

                                   <div className="flex-1 text-center md:text-left">
                                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{mentor.name}</h1>
                                        <div className="space-y-2">
                                             <div className="flex items-center justify-center md:justify-start gap-2 text-gray-700">
                                                  <Briefcase className="w-4 h-4 text-purple-600" />
                                                  <span className="font-semibold">{mentor.professionDetails?.title}</span>
                                             </div>
                                             <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                                                  <Award className="w-4 h-4 text-purple-600" />
                                                  <span>{mentor?.experienceSummary?.years} years of experience</span>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>

                         {/* Info Grid */}
                         <div className="p-8">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                   <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                        <Clock className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                             <p className="text-sm text-gray-500 mb-1">Timezone</p>
                                             <p className="font-semibold text-gray-900">{mentor.timeZone}</p>
                                        </div>
                                   </div>

                                   <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                        <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                             <p className="text-sm text-gray-500 mb-1">Current Organization</p>
                                             <p className="font-semibold text-gray-900">
                                                  {mentor?.currentOrganization?.organization}
                                             </p>
                                        </div>
                                   </div>
                              </div>

                              {/* About Section */}
                              <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-transparent rounded-lg border border-purple-100">
                                   <div className="flex items-center gap-2 mb-3">
                                        {/* <User className="w-5 h-5 text-purple-600" /> */}
                                        <h2 className="text-lg font-semibold text-gray-900">About Me</h2>
                                   </div>
                                   <p className="text-gray-700 leading-relaxed">{mentor?.bio}</p>
                              </div>

                              {/* Skills Sections */}

                              {mentor.skillsWanted?.length > 0 && (
                                   <div className="mb-8">
                                        <div className="flex items-center gap-2 mb-3">
                                             <Target className="w-5 h-5 text-blue-600" />
                                             <h2 className="text-lg font-semibold text-gray-900">
                                                  Skills I Needed to Learn
                                             </h2>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                             {mentor.skillsWanted.map((skill, index) => (
                                                  <Badge
                                                       key={skill.id || index}
                                                       className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors px-4 py-1.5"
                                                       variant="outline"
                                                  >
                                                       {skill.name}
                                                  </Badge>
                                             ))}
                                        </div>
                                   </div>
                              )}

                              {mentor.skillsOffered?.length > 0 && (
                                   <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-3">
                                             <Award className="w-5 h-5 text-purple-600" />
                                             <h2 className="text-lg font-semibold text-gray-900">Skills I Can Teach</h2>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                             {mentor.skillsOffered.map((skill, index) => (
                                                  <Badge
                                                       key={skill.id || index}
                                                       className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 transition-colors px-4 py-1.5"
                                                       variant="outline"
                                                  >
                                                       {skill.name}
                                                  </Badge>
                                             ))}
                                        </div>
                                   </div>
                              )}

                              {/* Request Mentorship Section */}
                              <div className="border-t pt-8">
                                   <h2 className="text-2xl font-bold text-gray-900 mb-6">Sent Connection</h2>

                                   <div className="space-y-6">
                                        {/* Skill Selection */}
                                        {mentor.skillsOffered?.length > 0 && (
                                             <div>
                                                  <label
                                                       htmlFor="skill"
                                                       className="block text-sm font-semibold text-gray-700 mb-2"
                                                  >
                                                       Choose a skill to learn *
                                                  </label>
                                                  <select
                                                       id="skill"
                                                       value={selectedSkillNames || ""}
                                                       onChange={(e) => {
                                                            setSelectedSkillNames(e.target.value);
                                                            setErrors((prev) => ({ ...prev, skill: false }));
                                                       }}
                                                       className={`w-full border ${
                                                            errors.skill ? "border-red-500" : "border-gray-300"
                                                       } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                                                  >
                                                       <option value="">Select a skill</option>
                                                       {mentor.skillsOffered.map((skill) => (
                                                            <option key={skill.id} value={skill.id}>
                                                                 {skill.name}
                                                            </option>
                                                       ))}
                                                  </select>
                                                  {errors.skill && (
                                                       <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                                                            <AlertCircle className="w-4 h-4" />
                                                            <span>Please select a skill</span>
                                                       </div>
                                                  )}
                                             </div>
                                        )}

                                        {/* Date Selection - Placeholder */}
                                        <div>
                                             <label
                                                  htmlFor="datetime"
                                                  className="block text-sm font-semibold text-gray-700 mb-2"
                                             >
                                                  Preferred date and time *
                                             </label>
                                             <div className="relative">
                                                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                  <input
                                                       type="datetime-local"
                                                       value={
                                                            selectedDate
                                                                 ? new Date(
                                                                        selectedDate.getTime() -
                                                                             selectedDate.getTimezoneOffset() * 60000
                                                                   )
                                                                        .toISOString()
                                                                        .slice(0, 16)
                                                                 : ""
                                                       }
                                                       onChange={(e) => {
                                                            setSelectedDate(
                                                                 e.target.value ? new Date(e.target.value) : null
                                                            );
                                                            setErrors((prev) => ({ ...prev, date: false }));
                                                       }}
                                                       className={`w-full border ${
                                                            errors.date ? "border-red-500" : "border-gray-300"
                                                       } rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                                                  />
                                             </div>
                                             {errors.date && (
                                                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                                                       <AlertCircle className="w-4 h-4" />
                                                       <span>Please select a date and time</span>
                                                  </div>
                                             )}
                                             {selectedDate && !errors.date && (
                                                  <p className="mt-2 text-sm text-gray-600">
                                                       Selected: {new Date(selectedDate).toLocaleString()}
                                                  </p>
                                             )}
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                             onClick={handleSubmitRequest}
                                             disabled={requestLoading || requestStatus}
                                             className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition-all ${
                                                  requestStatus
                                                       ? "bg-green-600 hover:bg-green-600"
                                                       : "bg-purple-600 hover:bg-purple-700"
                                             } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                             {requestStatus ? (
                                                  <span className="flex items-center gap-2">
                                                       <CheckCircle2 className="w-5 h-5" />
                                                       Request Sent
                                                  </span>
                                             ) : requestLoading ? (
                                                  "Submitting..."
                                             ) : (
                                                  "Submit Request"
                                             )}
                                        </Button>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </>
     );
}
