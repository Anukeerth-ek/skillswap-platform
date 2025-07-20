"use client";

import React, { useEffect, useState } from "react";
import { Plus, X, User, Clock, Globe, Book, Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";

const ProfileCreatePage = () => {
     const router = useRouter();

     type ProfileData = {
          name: string;
          bio: string;
          avatarUrl: string;
          timeZone: string;
          skillsOffered: string[];
          skillsWanted: string[];
     };
     type Skill = {
          id: string;
          name: string;
          category: string | null;
     };

     type Profile = {
          name: string;
          bio: string;
          avatarUrl: string;
          timeZone: string;
          skillsOffered: Skill[];
          skillsWanted: Skill[];
     };

     const [formData, setFormData] = useState<ProfileData>({
          name: "",
          bio: "",
          avatarUrl: "",
          timeZone: "",
          skillsOffered: [],
          skillsWanted: [],
     });

     const [newSkillOffered, setNewSkillOffered] = useState("");
     const [newSkillNeeded, setNewSkillNeeded] = useState("");
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
     const [profile, setProfile] = useState<Profile | null>(null);
     const [isEdit, setIsEdit] = useState(false);

     useEffect(() => {
          const avatarInput = document.getElementById("avatarFile") as HTMLInputElement;
          avatarInput?.addEventListener("change", () => {
               if (avatarInput.files?.[0]) {
                    const file = avatarInput.files[0];
                    setAvatarPreview(URL.createObjectURL(file));
               }
          });
     }, []);

     // Common timezones for selection
     const commonTimezones = [
          "UTC",
          "America/New_York",
          "America/Los_Angeles",
          "America/Chicago",
          "Europe/London",
          "Europe/Paris",
          "Europe/Berlin",
          "Asia/Tokyo",
          "Asia/Shanghai",
          "Asia/Dubai",
          "Australia/Sydney",
          "Asia/Kolkata",
     ];

     const handleInputChange = (e: any) => {
          const { name, value } = e.target;
          setFormData((prev) => ({
               ...prev,
               [name]: value,
          }));
     };

     const addSkillOffered = () => {
          if (newSkillOffered.trim() && !formData.skillsOffered.includes(newSkillOffered.trim())) {
               setFormData((prev) => ({
                    ...prev,
                    skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()],
               }));
               setNewSkillOffered("");
          }
     };

     interface RemoveSkillFn {
          (skillToRemove: string): void;
     }

     const removeSkillOffered: RemoveSkillFn = (skillToRemove) => {
          setFormData((prev) => ({
               ...prev,
               skillsOffered: prev.skillsOffered.filter((skill) => skill !== skillToRemove),
          }));
     };

     const addSkillNeeded = () => {
          if (newSkillNeeded.trim() && !formData.skillsWanted.includes(newSkillNeeded.trim())) {
               setFormData((prev) => ({
                    ...prev,
                    skillsWanted: [...prev.skillsWanted, newSkillNeeded.trim()],
               }));
               setNewSkillNeeded("");
          }
     };

     interface RemoveSkillNeededFn {
          (skillToRemove: string): void;
     }

     const removeSkillNeeded: RemoveSkillNeededFn = (skillToRemove) => {
          setFormData((prev) => ({
               ...prev,
               skillsWanted: prev.skillsWanted.filter((skill) => skill !== skillToRemove),
          }));
     };

     interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

     interface ApiResponse {
          ok: boolean;
          // Add more fields if your API returns them
     }
     const handleSubmit = async (e: HandleSubmitEvent): Promise<void> => {
          e.preventDefault();
          setIsSubmitting(true);

          try {
               const token = localStorage.getItem("token");
               if (!token) {
                    console.error("No auth token found");
                    return;
               }

               const avatarFileInput = document.getElementById("avatarFile") as HTMLInputElement;
               const avatarFile = avatarFileInput?.files?.[0];

               const formDataToSend = new FormData();
               formDataToSend.append("name", formData.name);
               formDataToSend.append("bio", formData.bio || "");
               formDataToSend.append("timeZone", formData.timeZone || "");

               if (avatarFile) {
                    formDataToSend.append("avatar", avatarFile); // 👈 this is the actual file
               }

               formData.skillsOffered.forEach((skill) => {
                    formDataToSend.append("skillsOffered[]", skill);
               });

               formData.skillsWanted.forEach((skill) => {
                    formDataToSend.append("skillsWanted[]", skill);
               });
               const url = isEdit
                    ? "http://localhost:4000/api/profile/update" // PUT for update
                    : "http://localhost:4000/api/profile"; // POST for create

               const response = await fetch(url, {
                    method: isEdit ? "PUT" : "POST",
                    headers: {
                         Authorization: `Bearer ${token}`,
                    },
                    body: formDataToSend,
               });

               if (response.ok) {
                    router.push("/");
                    console.log("Profile created successfully!");
               } else {
                    const errData = await response.json();
                    console.error("Failed to create profile", errData);
               }
          } catch (error) {
               console.error("Error creating profile:", error);
          } finally {
               setIsSubmitting(false);
          }
     };

     useEffect(() => {
          const token = localStorage.getItem("token");
          if (!token) {
               router.push("/"); // or redirect to /login
          }
     }, []);
     useEffect(() => {
          const fetchProfile = async () => {
               const token = localStorage.getItem("token");
               const res = await fetch("http://localhost:4000/api/profile/me", {
                    method: "GET",
                    headers: {
                         Authorization: `Bearer ${token}`,
                    },
               });

               const data = await res.json();
               if (res.ok && data.user) {
                    setProfile(data.user);
                    setIsEdit(true); // ✅ important
                    setFormData({
                         name: data.user.name || "",
                         bio: data.user.bio || "",
                         avatarUrl: data.user.avatarUrl || "",
                         timeZone: data.user.timeZone || "",
                         skillsOffered: data.user.skillsOffered?.map((s: any) => s.name) || [],
                         skillsWanted: data.user.skillsWanted?.map((s: any) => s.name) || [],
                    });
                    if (data.user.avatarUrl) {
                         setAvatarPreview(data.user.avatarUrl);
                    }
               }
          };

          fetchProfile();
     }, []);

     console.log("helo anu", profile);

     console.log("backy", profile?.skillsWanted);
     return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
               <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                         <div className="text-center mb-8">
                              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                   <User className="w-8 h-8 text-white" />
                              </div>
                              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                   {" "}
                                   {isEdit ? "Edit Your Profile" : "Create Your Profile"}
                              </h1>
                              <p className="text-gray-600">Share your skills and discover new ones in our community</p>
                         </div>

                         <form onSubmit={handleSubmit} className="space-y-6">
                              {/* Name Field */}
                              <div>
                                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                   </label>
                                   <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="Enter your full name"
                                   />
                              </div>
                              {/* Profession Field */}
                              <div>
                                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Please Add your profession*
                                   </label>
                                   <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="Enter your current profession"
                                   />
                              </div>

                              {/* Professional Experience in years*/}
                              <div>
                                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Enter your professional experience (In years)*
                                   </label>
                                   <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="Eg: If its is 5 year, enter 5"
                                   />
                              </div>

                              {/* Current organisation*/}
                              <div>
                                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Enter your professional experience (In years)*
                                   </label>
                                   <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="Eg: If its is 5 year, enter 5"
                                   />
                              </div>

                              {/* Bio Field */}
                              <div>
                                   <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                                        Bio
                                   </label>
                                   <textarea
                                        id="bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                                        placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                                   />
                              </div>

                              {/* Avatar Upload Field */}
                              <div>
                                   <label htmlFor="avatarFile" className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Avatar
                                   </label>
                                   <input
                                        type="file"
                                        id="avatarFile"
                                        name="avatar"
                                        accept="image/*"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                   />

                                   {avatarPreview && (
                                        <img
                                             src={avatarPreview}
                                             alt="Preview"
                                             className="w-24 h-24 rounded-full mt-3 object-cover border border-gray-300"
                                        />
                                   )}
                              </div>

                              {/* Timezone Field */}
                              <div>
                                   <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700 mb-2">
                                        <Clock className="inline w-4 h-4 mr-1" />
                                        Time Zone
                                   </label>
                                   <select
                                        id="timeZone"
                                        name="timeZone"
                                        value={formData.timeZone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                   >
                                        <option value="">Select your timezone</option>
                                        {commonTimezones.map((tz) => (
                                             <option key={tz} value={tz}>
                                                  {tz}
                                             </option>
                                        ))}
                                   </select>
                              </div>

                              {/* Skills Offered */}
                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Lightbulb className="inline w-4 h-4 mr-1" />
                                        Skills You Can Offer
                                   </label>

                                   <div className="flex gap-2 mb-3">
                                        <input
                                             type="text"
                                             value={newSkillOffered}
                                             onChange={(e) => setNewSkillOffered(e.target.value)}
                                             onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkillOffered())}
                                             className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                             placeholder="e.g., JavaScript, Cooking, Photography"
                                        />
                                        <button
                                             type="button"
                                             onClick={addSkillOffered}
                                             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                                        >
                                             <Plus className="w-4 h-4" />
                                             Add
                                        </button>
                                   </div>

                                   <div className="flex flex-wrap gap-2">
                                        {formData.skillsOffered.map((skill, index) => (
                                             <span
                                                  key={index}
                                                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                             >
                                                  {skill}
                                                  <button
                                                       type="button"
                                                       onClick={() => removeSkillOffered(skill)}
                                                       className="text-blue-600 hover:text-blue-800"
                                                  >
                                                       <X className="w-3 h-3" />
                                                  </button>
                                             </span>
                                        ))}
                                   </div>
                              </div>

                              {/* Skills Needed */}
                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Book className="inline w-4 h-4 mr-1" />
                                        Skills You Want to Learn
                                   </label>

                                   <div className="flex gap-2 mb-3">
                                        <input
                                             type="text"
                                             value={newSkillNeeded}
                                             onChange={(e) => setNewSkillNeeded(e.target.value)}
                                             onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkillNeeded())}
                                             className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                             placeholder="e.g., Python, Guitar, Public Speaking"
                                        />
                                        <button
                                             type="button"
                                             onClick={addSkillNeeded}
                                             className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                                        >
                                             <Plus className="w-4 h-4" />
                                             Add
                                        </button>
                                   </div>

                                   <div className="flex flex-wrap gap-2">
                                        {formData.skillsWanted.map((skill, index) => (
                                             <span
                                                  key={index}
                                                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                                             >
                                                  {skill}
                                                  <button
                                                       type="button"
                                                       onClick={() => removeSkillNeeded(skill)}
                                                       className="text-green-600 hover:text-green-800"
                                                  >
                                                       <X className="w-3 h-3" />
                                                  </button>
                                             </span>
                                        ))}
                                   </div>
                              </div>

                              {/* Submit Button */}
                              <button
                                   type="submit"
                                   disabled={isSubmitting || !formData.name.trim()}
                                   className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                   {isSubmitting ? (
                                        <div className="flex items-center justify-center gap-2">
                                             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                             {isEdit ? "Updating Profile..." : "Creating Profile..."}
                                        </div>
                                   ) : (
                                        "Create Profile"
                                   )}
                              </button>
                         </form>
                    </div>
               </div>
          </div>
     );
};

export default ProfileCreatePage;
