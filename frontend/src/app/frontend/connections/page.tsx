"use client";

import { useState, useMemo } from 'react';
import { Search, Filter, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    id: '1',
    name: 'Darlene Robertson',
    jobTitle: 'Project Manager',
    department: 'Management',
    phoneNumber: '(201) 555-0124',
    email: 'darlener@epic.com',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: '2',
    name: 'Kristin Watson',
    jobTitle: 'Office Manager',
    department: 'Office',
    phoneNumber: '(629) 555-0129',
    email: 'kristinw@epic.com',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: '3',
    name: 'Bessie Cooper',
    jobTitle: 'Developer',
    department: 'Development',
    phoneNumber: '(225) 555-0118',
    email: 'bessie@epic.com',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: '4',
    name: 'Brooklyn Simmons',
    jobTitle: 'Developer',
    department: 'Development',
    phoneNumber: '(308) 555-0121',
    email: 'brooklyns@epic.com',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: '5',
    name: 'Eleanor Pena',
    jobTitle: 'Developer',
    department: 'Development',
    phoneNumber: '(303) 555-0105',
    email: 'eleanorp@epic.com',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: '6',
    name: 'Savannah Nguyen',
    jobTitle: 'Designer',
    department: 'Marketing',
    phoneNumber: '(207) 555-0119',
    email: 'savannahh@epic.com',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: '7',
    name: 'Dianne Russell',
    jobTitle: 'Designer',
    department: 'Marketing',
    phoneNumber: '(252) 555-0126',
    email: 'dianner@epic.com',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: '8',
    name: 'Courtney Henry',
    jobTitle: 'Content Writer',
    department: 'Marketing',
    phoneNumber: '(302) 555-0107',
    email: 'courtneyh@epic.com',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: '9',
    name: 'Jacob Jones',
    jobTitle: 'Brand Manager',
    department: 'Marketing',
    phoneNumber: '(208) 555-0112',
    email: 'jacobsj@epic.com',
    avatar: '/api/placeholder/32/32'
  },
  {
    id: '10',
    name: 'Jenny Wilson',
    jobTitle: 'Sales Manager',
    department: 'Sales & Business',
    phoneNumber: '(406) 555-0120',
    email: 'jennyw@epic.com',
    avatar: '/api/placeholder/32/32'
  }
];

const departments = [
  'All Departments',
  'Management',
  'Office',
  'Development',
  'Marketing',
  'Sales & Business'
];

const getDepartmentColor = (department: string) => {
  const colors = {
    'Management': 'bg-orange-100 text-orange-800',
    'Office': 'bg-blue-100 text-blue-800',
    'Development': 'bg-cyan-100 text-cyan-800',
    'Marketing': 'bg-pink-100 text-pink-800',
    'Sales & Business': 'bg-green-100 text-green-800'
  };
  return colors[department as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export default function ConnectionListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredConnections = useMemo(() => {
    return mockconnections.filter(connection => {
      const matchesSearch = 
        connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        connection.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        connection.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        connection.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = 
        selectedDepartment === 'All Departments' || 
        connection.department === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [searchTerm, selectedDepartment]);

  const handleRowSelect = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === filteredConnections.length 
        ? [] 
        : filteredConnections.map(c => c.id)
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add connection
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-6 py-3 text-left">
                <Checkbox 
                  checked={selectedRows.length === filteredConnections.length && filteredConnections.length > 0}
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
            {filteredConnections.slice(0, rowsPerPage).map((connection) => (
              <tr key={connection.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Checkbox 
                    checked={selectedRows.includes(connection.id)}
                    onCheckedChange={() => handleRowSelect(connection.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={connection.avatar} alt={connection.name} />
                      <AvatarFallback className="text-xs">
                        {getInitials(connection.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium text-gray-900">
                      {connection.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{connection.jobTitle}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={getDepartmentColor(connection.department)}>
                    {connection.department}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{connection.phoneNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{connection.email}</div>
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
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              1-8 of {filteredConnections.length}
            </span>
            <span className="text-sm text-gray-500">Rows per page:</span>
            <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
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
              {[1, 2, 3, 4, 5, 6].map(page => (
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