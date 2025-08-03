"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect } from "react";
import { useAuthUser } from "@/app/hooks/useAuth";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface connection {
     id: string;
     name: string;
     jobTitle: string;
     department: string;
     phoneNumber: string;
     email: string;
     avatar?: string;
}

const mockconnections: connection[] = [
     {
          id: "1",
          name: "Darlene Robertson",
          jobTitle: "Project Manager",
          department: "Management",
          phoneNumber: "(201) 555-0124",
          email: "darlener@epic.com",
          avatar: "/api/placeholder/32/32",
     },
     {
          id: "2",
          name: "Kristin Watson",
          jobTitle: "Office Manager",
          department: "Office",
          phoneNumber: "(629) 555-0129",
          email: "kristinw@epic.com",
          avatar: "/api/placeholder/32/32",
     },
     {
          id: "3",
          name: "Bessie Cooper",
          jobTitle: "Developer",
          department: "Development",
          phoneNumber: "(225) 555-0118",
          email: "bessie@epic.com",
          avatar: "/api/placeholder/32/32",
     },
     {
          id: "4",
          name: "Brooklyn Simmons",
          jobTitle: "Developer",
          department: "Development",
          phoneNumber: "(308) 555-0121",
          email: "brooklyns@epic.com",
          avatar: "/api/placeholder/32/32",
     },
     {
          id: "5",
          name: "Eleanor Pena",
          jobTitle: "Developer",
          department: "Development",
          phoneNumber: "(303) 555-0105",
          email: "eleanorp@epic.com",
          avatar: "/api/placeholder/32/32",
     },
     {
          id: "6",
          name: "Savannah Nguyen",
          jobTitle: "Designer",
          department: "Marketing",
          phoneNumber: "(207) 555-0119",
          email: "savannahh@epic.com",
          avatar: "/api/placeholder/32/32",
     },
     {
          id: "7",
          name: "Dianne Russell",
          jobTitle: "Designer",
          department: "Marketing",
          phoneNumber: "(252) 555-0126",
          email: "dianner@epic.com",
          avatar: "/api/placeholder/32/32",
     },
     {
          id: "8",
          name: "Courtney Henry",
          jobTitle: "Content Writer",
          department: "Marketing",
          phoneNumber: "(302) 555-0107",
          email: "courtneyh@epic.com",
          avatar: "/api/placeholder/32/32",
     },
     {
          id: "9",
          name: "Jacob Jones",
          jobTitle: "Brand Manager",
          department: "Marketing",
          phoneNumber: "(208) 555-0112",
          email: "jacobsj@epic.com",
          avatar: "/api/placeholder/32/32",
     },
     {
          id: "10",
          name: "Jenny Wilson",
          jobTitle: "Sales Manager",
          department: "Sales & Business",
          phoneNumber: "(406) 555-0120",
          email: "jennyw@epic.com",
          avatar: "/api/placeholder/32/32",
     },
];

const departments = ["All Departments", "Management", "Office", "Development", "Marketing", "Sales & Business"];

const getDepartmentColor = (department: string) => {
     const colors = {
          Management: "bg-orange-100 text-orange-800",
          Office: "bg-blue-100 text-blue-800",
          Development: "bg-cyan-100 text-cyan-800",
          Marketing: "bg-pink-100 text-pink-800",
          "Sales & Business": "bg-green-100 text-green-800",
     };
     return colors[department as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export default function ConnectionListPage() {
     const [searchTerm, setSearchTerm] = useState("");
     const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
     const [selectedRows, setSelectedRows] = useState<string[]>([]);
     const [rowsPerPage, setRowsPerPage] = useState(10);
     const [usersConnection, setUsersConnection] = useState<any[]>([]);
     const { user: currentUser } = useAuthUser();

     const router = useRouter()

     useEffect(() => {
          if (!currentUser?.id) return;
          const fetchUsersConnection = async () => {
               const res = await fetch(`http://localhost:4000/api/connections/${currentUser?.id}`);
               const data = await res.json();
               console.table("dfjdklf", data);
               setUsersConnection(data.connections);
          };
          fetchUsersConnection();
     }, [currentUser?.id]);

     const filteredConnections = useMemo(() => {
          return usersConnection?.filter((connection) => {
               const matchesSearch =
                    connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    connection.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    connection.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    connection.email.toLowerCase().includes(searchTerm.toLowerCase());

               const matchesDepartment =
                    selectedDepartment === "All Departments" || connection.department === selectedDepartment;

               return matchesSearch && matchesDepartment;
          });
     }, [searchTerm, selectedDepartment]);

     const handleRowSelect = (id: string) => {
          setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
     };

     const handleSelectAll = () => {
          setSelectedRows(selectedRows.length === filteredConnections.length ? [] : filteredConnections.map((c) => c.id));
     };

     const getInitials = (name: string) => {
          return name
               .split(" ")
               .map((n) => n[0])
               .join("")
               .toUpperCase();
     };

     //  const { user: currentUser } = useAuthUser();
     const [showPopover, setShowPopover] = useState(false);
     const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
     const [loadingRequests, setLoadingRequests] = useState(false);

     useEffect(() => {
          if (!currentUser?.id) {
               return;
          }
          const fetchIncoming = async () => {
               try {
                    const res = await fetch(`http://localhost:4000/api/connections/requests/incoming/${currentUser?.id}`);
                    const data = await res.json();

                    if (res.ok) {
                         setIncomingRequests(data || []);
                    } else {
                         toast.error(data.message || "Failed to load invitations");
                    }
               } catch (err) {
                    console.error(err);
                    toast.error("Something went wrong");
               }
          };
          //  if (!currentUser?.id) {

          //  }
          // if (currentUser?.id) {
          fetchIncoming();
          // }
     }, [currentUser?.id]);

     const fetchIncomingRequests = async () => {
          if (!currentUser?.id) return;
          setLoadingRequests(true);
          try {
               const res = await fetch(`http://localhost:4000/api/connections/requests/incoming/${currentUser.id}`);
               const data = await res.json();

               setIncomingRequests(data || []);
          } catch (err) {
               toast.error("Failed to load connection requests");
          } finally {
               setLoadingRequests(false);
          }
     };

     const handleAccept = async (connectionId: string) => {
          try {
               const res = await fetch("http://localhost:4000/api/connections/accept", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ connectionId }),
               });

               if (res.ok) {
                    toast.success("Connection accepted");
                    setIncomingRequests((prev) => prev.filter((c) => c.id !== connectionId));

                    // ✅ Re-fetch the accepted connections to update the table
                    const updated = await fetch(`http://localhost:4000/api/connections/${currentUser?.id}`);
                    const data = await updated.json();
                    setUsersConnection(data);
               } else {
                    const error = await res.json();
                    toast.error(error.message || "Failed to accept");
               }
          } catch {
               toast.error("Something went wrong");
          }
     };

     const handleDecline = async (connectionId: string) => {
          try {
               const res = await fetch("http://localhost:4000/api/connections/decline", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ connectionId }),
               });

               if (res.ok) {
                    toast.info("Connection declined");
                    setIncomingRequests((prev) => prev.filter((c) => c.id !== connectionId));
               } else {
                    const error = await res.json();
                    toast.error(error.message || "Failed to decline");
               }
          } catch {
               toast.error("Something went wrong");
          }
     };

     return (
          <div className="bg-white rounded-lg shadow-sm border">
               {/* Header */}
               <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                              <div className="relative">
                                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                   <Input
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-80"
                                   />
                              </div>
                              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                   <SelectTrigger className="w-48">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Filters" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        {departments.map((dept) => (
                                             <SelectItem key={dept} value={dept}>
                                                  {dept}
                                             </SelectItem>
                                        ))}
                                   </SelectContent>
                              </Select>
                         </div>
                         <Popover
                              open={showPopover}
                              onOpenChange={(open) => {
                                   setShowPopover(open);
                                   if (open) fetchIncomingRequests();
                              }}
                         >
                              <PopoverTrigger asChild>
                                   <div className="relative inline-block">
                                        <Button className="bg-blue-600 cursor-pointer hover:bg-blue-700 pr-4 pl-4">
                                             My Invitations
                                        </Button>

                                        {incomingRequests.length > 0 && (
                                             <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
                                                  {incomingRequests.length}
                                             </span>
                                        )}
                                   </div>
                              </PopoverTrigger>

                              <PopoverContent className="w-80 p-4">
                                   <h4 className="font-semibold mb-2">Incoming Requests</h4>

                                   {loadingRequests ? (
                                        <p className="text-sm text-gray-500">Loading...</p>
                                   ) : incomingRequests.length === 0 ? (
                                        <p className="text-sm text-gray-500">No pending requests</p>
                                   ) : (
                                        <div className="max-h-60 overflow-y-auto space-y-3">
                                             {incomingRequests.map((conn) => (
                                                  <div key={conn.id} className="border p-2 rounded-md">
                                                       <p className="text-sm font-medium">{conn.sender.name}</p>
                                                       <div className="flex gap-2 mt-2">
                                                            <Button
                                                                 variant="default"
                                                                 size="sm"
                                                                 onClick={() => handleAccept(conn.id)}
                                                            >
                                                                 Accept
                                                            </Button>
                                                            <Button
                                                                 variant="outline"
                                                                 size="sm"
                                                                 onClick={() => handleDecline(conn.id)}
                                                            >
                                                                 Decline
                                                            </Button>
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   )}
                              </PopoverContent>
                         </Popover>
                    </div>
               </div>

               {/* Table */}
               <div className="overflow-x-auto">
                    <table className="w-full">
                         <thead className="bg-gray-50">
                              <tr>
                                   <th className="w-12 px-6 py-3 text-left">
                                        <Checkbox
                                             checked={
                                                  selectedRows.length === filteredConnections.length &&
                                                  filteredConnections.length > 0
                                             }
                                             onCheckedChange={handleSelectAll}
                                        />
                                   </th>
                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        connection Name
                                   </th>
                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Job Title
                                   </th>
                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Profession
                                   </th>
                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Skill Offered
                                   </th>
                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Skill Wanted
                                   </th>
                                   <th className="w-12 px-6 py-3"></th>
                              </tr>
                         </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                              {usersConnection.length > 0 ? (
                                   usersConnection?.map((connection: any) => {
                                        console.log("ipl", connection?.user);
                                        return (
                                             <tr className="hover:bg-gray-50 cursor-pointer"  key={connection.id} onClick={()=> router.push(`/frontend/connections/${connection.id}`)}>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                       <Checkbox
                                                            checked={selectedRows.includes(connection.id)}
                                                            onCheckedChange={() => handleRowSelect(connection.id)}
                                                       />
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                       <div className="flex items-center">
                                                            <Avatar className="h-8 w-8 mr-3">
                                                                 <AvatarImage
                                                                      src={connection.avatar}
                                                                      alt={connection.name}
                                                                 />
                                                                 {/* <AvatarFallback className="text-xs">
                                                                 {getInitials(connection?.name)}
                                                            </AvatarFallback> */}
                                                            </Avatar>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                 {connection.user.name}
                                                            </div>
                                                       </div>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                       <div className="text-sm text-gray-900">software engineer</div>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                       <Badge className={getDepartmentColor(connection.department)}>
                                                            {connection.department}
                                                       </Badge>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                       {connection?.user?.skillsOffered?.map((item: any, index: number) => (
                                                            <div key={index} className="text-sm text-gray-900">
                                                                 {item.name}
                                                            </div>
                                                       ))}
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                       {connection?.user?.skillsWanted?.map((item: any, index: number) => (
                                                            <div key={index} className="text-sm text-gray-900">
                                                                 {item.name}
                                                            </div>
                                                       ))}
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                       <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                 <Button variant="ghost" className="h-8 w-8 p-0">
                                                                      <MoreHorizontal className="h-4 w-4" />
                                                                 </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                 <DropdownMenuItem>Edit</DropdownMenuItem>
                                                                 <DropdownMenuItem>View Details</DropdownMenuItem>
                                                                 <DropdownMenuItem className="text-red-600">
                                                                      Delete
                                                                 </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                       </DropdownMenu>
                                                  </td>
                                             </tr>
                                        );
                                   })
                              ) : (
                                   <tr>
                                        <td colSpan={7} className="text-center py-4 text-gray-500">
                                             You have no connections.
                                        </td>
                                   </tr>
                              )}
                         </tbody>
                    </table>
               </div>

               {/* Pagination */}
               <div className="px-6 py-3 border-t bg-gray-50">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-700">1-8 of {filteredConnections.length}</span>
                              <span className="text-sm text-gray-500">Rows per page:</span>
                              <Select
                                   value={rowsPerPage.toString()}
                                   onValueChange={(value) => setRowsPerPage(Number(value))}
                              >
                                   <SelectTrigger className="w-20">
                                        <SelectValue />
                                   </SelectTrigger>
                                   <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                   </SelectContent>
                              </Select>
                         </div>
                         <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" disabled>
                                   Back
                              </Button>
                              <div className="flex gap-1">
                                   {[1, 2, 3, 4, 5, 6].map((page) => (
                                        <Button
                                             key={page}
                                             variant={page === 1 ? "default" : "outline"}
                                             size="sm"
                                             className="w-8 h-8"
                                        >
                                             {page}
                                        </Button>
                                   ))}
                              </div>
                              <Button variant="outline" size="sm">
                                   Next
                              </Button>
                         </div>
                    </div>
               </div>
          </div>
     );
}
