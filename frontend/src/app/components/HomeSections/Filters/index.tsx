import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";

export const LeftSidebar = ({ filters, setFilters }: any) => {
     const toggleFilter = (category: string, value: string) => {
          setFilters((prev: any) => {
               const updated = prev[category].includes(value)
                    ? prev[category].filter((v: any) => v !== value)
                    : [...prev[category], value];
               return { ...prev, [category]: updated };
          });
     };

     // ✅ update company search
     const handleSearchCompany = (e: React.ChangeEvent<HTMLInputElement>) => {
          setFilters((prev: any) => ({ ...prev, company: e.target.value }));
     };

     // ✅ update sort
     const handleSortChange = (value: string) => {
          setFilters((prev: any) => ({ ...prev, sort: value }));
     };

     // ✅ reset
     const handleReset = () => {
          setFilters({
               search: "",
               professional: [],
               experience: [],
               company: "",
               sort: "most-experienced",
          });
     };
     return (
          <div className="w-64 bg-gray-900 text-white p-6 space-y-6">
               <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Filters</h2>
                    <Button onClick={handleReset} variant="ghost" size="sm" className="text-purple-400 hover:text-white">
                         Reset All
                    </Button>
               </div>

               <div>
                    <h3 className="font-medium mb-3">Sort By</h3>
                    <RadioGroup value={filters.sort} onValueChange={handleSortChange} className="space-y-2">
                         <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                   value="most-experienced"
                                   id="most-experienced"
                                   className="border-purple-400 text-purple-400"
                              />
                              <Label htmlFor="most-experienced" className="text-sm">
                                   Most Experienced
                              </Label>
                         </div>

                         <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                   value="least-experienced"
                                   id="least-experienced"
                                   className="border-purple-400 text-purple-400"
                              />
                              <Label htmlFor="least-experienced" className="text-sm">
                                   Least Experienced
                              </Label>
                         </div>
                    </RadioGroup>
               </div>

               <div>
                    <h3 className="font-medium mb-3">Company Name</h3>

                    {/* <div className="flex items-center space-x-2">
                              <Checkbox
                                   id="Google"
                                   value="Google"
                                   className="border-purple-400 data-[state=checked]:bg-purple-600"
                              />
                              <Label htmlFor="Google" className="text-sm">
                                   Google
                              </Label>
                         </div>
                         <div className="flex items-center space-x-2">
                              <Checkbox
                                   id="Meta"
                                   value="Meta"
                                   className="border-purple-400 data-[state=checked]:bg-purple-600"
                              />
                              <Label htmlFor="Meta" className="text-sm">
                                   Meta
                              </Label>
                         </div> */}
                    <div className="relative flex-1">
                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                         <input
                              className="pl-10 font-light py-1 rounded-xs text-base bg-gray-800 border-gray-700 text-gray-500 placeholder-gray-400"
                              placeholder="Search Company Name"
                              value={filters.company}
                              onChange={handleSearchCompany}
                         />
                    </div>
               </div>

               <h3 className="font-medium mb-3">Professional</h3>
               <div className="flex flex-col space-y-2">
                    {["frontend", "backend", "fullstack", "devops", "python", "more"].map((role) => (
                         <div key={role} className="flex items-center space-x-2">
                              <Checkbox
                                   id={role}
                                   checked={filters.professional.includes(role)}
                                   onCheckedChange={() => toggleFilter("professional", role)}
                                   className="border-purple-400 data-[state=checked]:bg-purple-600"
                              />
                              <Label htmlFor={role} className="text-sm capitalize">
                                   {role}
                              </Label>
                         </div>
                    ))}
               </div>

               {/* <div>
        <h3 className="font-medium mb-3">Hour Rate</h3>
        <Slider
          defaultValue={[8, 39]}
          max={100}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>$8</span>
          <span>$39</span>
        </div>
      </div> */}

               {/* <div>
                    <h3 className="font-medium mb-3">Readiness</h3>
                    <div className="space-y-2">
                         <div className="flex items-center space-x-2">
                              <Checkbox
                                   id="Available"
                                   value="Available"
                                   className="border-purple-400 data-[state=checked]:bg-purple-600"
                              />
                              <Label htmlFor="Available" className="text-sm">
                                   Available
                              </Label>
                         </div>
                         <div className="flex items-center space-x-2">
                              <Checkbox
                                   id="Connected"
                                   value="Connected"
                                   className="border-purple-400 data-[state=checked]:bg-purple-600"
                              />
                              <Label htmlFor="Connected" className="text-sm">
                                   Hired
                              </Label>
                         </div>
                    </div>
               </div> */}

               <div>
                    <h3 className="font-medium mb-3">Experience</h3>
                    {["1-3", "4-8", "9-14", "15+"].map((exp) => (
                         <div key={exp} className="flex items-center space-x-2">
                              <Checkbox
                                   id={exp}
                                   checked={filters.experience.includes(exp)}
                                   onCheckedChange={() => toggleFilter("experience", exp)}
                              />
                              <Label htmlFor={exp} className="text-sm">
                                   {exp}
                              </Label>
                         </div>
                    ))}
               </div>

               {/* <div>
        <h3 className="font-medium mb-3">Dialogue</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="zoom" />
            <Label htmlFor="zoom" className="text-sm">Zoom</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="google-meet" />
            <Label htmlFor="google-meet" className="text-sm">Google Meet</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="skype" defaultChecked className="border-purple-400 data-[state=checked]:bg-purple-600" />
            <Label htmlFor="skype" className="text-sm">Skype</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="cisco" />
            <Label htmlFor="cisco" className="text-sm">Cisco WebEx</Label>
          </div>
        </div>
      </div> */}
          </div>
          // </div>
     );
};
