import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

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
        <RadioGroup defaultValue="experienced">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="experienced" id="experienced" className="border-purple-400 text-purple-400" />
            <Label htmlFor="experienced" className="text-sm">Most Experienced</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rate" id="rate" />
            <Label htmlFor="rate" className="text-sm">Low Hour Rate</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
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
      </div>
      
      <div>
        <h3 className="font-medium mb-3">Readiness</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="available" defaultChecked className="border-purple-400 data-[state=checked]:bg-purple-600" />
            <Label htmlFor="available" className="text-sm">Available</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="hired" />
            <Label htmlFor="hired" className="text-sm">Hired</Label>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-3">Experience</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="1-3" />
            <Label htmlFor="1-3" className="text-sm">1-3</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="4-8" defaultChecked className="border-purple-400 data-[state=checked]:bg-purple-600" />
            <Label htmlFor="4-8" className="text-sm">4-8</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="9-14" defaultChecked className="border-purple-400 data-[state=checked]:bg-purple-600" />
            <Label htmlFor="9-14" className="text-sm">9-14</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="15+" defaultChecked className="border-purple-400 data-[state=checked]:bg-purple-600" />
            <Label htmlFor="15+" className="text-sm">15+</Label>
          </div>
        </div>
      </div>
      
      <div>
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
      </div>
    </div>
  );
};