import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export const LeftSidebar = () => {
     return (
          <div className="w-64 bg-gray-900 text-white p-6 space-y-6">
               <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Filters</h2>
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white">
                         Reset All
                    </Button>
               </div>

               <div>
                    <h3 className="font-medium mb-3">Sort By</h3>
                    <RadioGroup defaultValue="most-experienced">
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
                              <RadioGroupItem value="least-experienced" id="least-experienced" />
                              <Label htmlFor="least-experienced" className="text-sm">
                                   Least to Most Experienced
                              </Label>
                         </div>
                    </RadioGroup>
               </div>

               <h3 className="font-medium mb-3">Professional</h3>
               <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                         <Checkbox
                              id="frontend"
                              value="frontend"
                              className="border-purple-400 data-[state=checked]:bg-purple-600"
                         />
                         <Label htmlFor="frontend" className="text-sm">
                              Frontend
                         </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                         <Checkbox
                              id="backend"
                              value="backend"
                              className="border-purple-400 data-[state=checked]:bg-purple-600"
                         />
                         <Label htmlFor="backend" className="text-sm">
                              Backend
                         </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                         <Checkbox
                              id="fullstack"
                              value="fullstack"
                              className="border-purple-400 data-[state=checked]:bg-purple-600"
                         />
                         <Label htmlFor="fullstack" className="text-sm">
                              Full Stack
                         </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                         <Checkbox
                              id="devops"
                              value="devops"
                              className="border-purple-400 data-[state=checked]:bg-purple-600"
                         />
                         <Label htmlFor="devops" className="text-sm">
                              DevOps
                         </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                         <Checkbox
                              id="python"
                              value="python"
                              className="border-purple-400 data-[state=checked]:bg-purple-600"
                         />
                         <Label htmlFor="python" className="text-sm">
                              Python
                         </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                         <Checkbox
                              id="more"
                              value="more"
                              className="border-purple-400 data-[state=checked]:bg-purple-600"
                         />
                         <Label htmlFor="more" className="text-sm">
                              More
                         </Label>
                    </div>
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

               <div>
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
               </div>

               <div>
                    <h3 className="font-medium mb-3">Experience</h3>
                    <div className="space-y-2">
                         <div className="flex items-center space-x-2">
                              <Checkbox
                                   id="1-3"
                                   value="1-3"
                                   className="border-purple-400 data-[state=checked]:bg-purple-600"
                              />
                              <Label htmlFor="1-3" className="text-sm">
                                   1-3
                              </Label>
                         </div>
                         <div className="flex items-center space-x-2">
                              <Checkbox
                                   id="4-8"
                                   // defaultChecked
                                   value="4-8"
                                   className="border-purple-400 data-[state=checked]:bg-purple-600"
                              />
                              <Label htmlFor="4-8" className="text-sm">
                                   4-8
                              </Label>
                         </div>
                         <div className="flex items-center space-x-2">
                              <Checkbox
                                   id="9-14"
                                   value="9-14"
                                   // defaultChecked
                                   className="border-purple-400 data-[state=checked]:bg-purple-600"
                              />
                              <Label htmlFor="9-14" className="text-sm">
                                   9-14
                              </Label>
                         </div>
                         <div className="flex items-center space-x-2">
                              <Checkbox
                                   id="15+"
                                   value="15+"
                                   // defaultChecked
                                   className="border-purple-400 data-[state=checked]:bg-purple-600"
                              />
                              <Label htmlFor="15+" className="text-sm">
                                   15+
                              </Label>
                         </div>
                    </div>
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
