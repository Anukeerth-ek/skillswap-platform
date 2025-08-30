"use client"
import React, { useState } from 'react';
import { Search, Phone, MoreHorizontal, Send, Mic, Paperclip, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Mock data
const messages = [
  {
    id: 1,
    name: 'Albert Flores',
    message: 'Hi, I\'m confirming your check-in...',
    time: '10:37',
    avatar: '/api/placeholder/32/32',
    unread: 0,
    isOnline: true
  },
  {
    id: 2,
    name: 'Annette Black',
    message: 'I\'m arriving tomorrow afternoon.',
    time: '9:15',
    avatar: '/api/placeholder/32/32',
    unread: 1,
    isOnline: false
  },
  {
    id: 3,
    name: 'Edwin Johnson',
    message: 'Cool! Is there a coffee machine...',
    time: '8:01',
    avatar: '/api/placeholder/32/32',
    unread: 0,
    isOnline: true
  },
  {
    id: 4,
    name: 'Jerome Bell',
    message: 'I\'ve received your booking request...',
    time: 'Thu',
    avatar: '/api/placeholder/32/32',
    unread: 0,
    isOnline: false
  },
  {
    id: 5,
    name: 'Darrell Steward',
    message: 'Hello! Just a reminder that chec...',
    time: 'Thu',
    avatar: '/api/placeholder/32/32',
    unread: 0,
    isOnline: true
  },
  {
    id: 6,
    name: 'Steven Jordan',
    message: 'Sounds good! Could you confir...',
    time: 'Wed',
    avatar: '/api/placeholder/32/32',
    unread: 2,
    isOnline: false
  },
  {
    id: 7,
    name: 'Wanda Hall',
    message: 'Thanks for the update! Just to cl...',
    time: 'Wed',
    avatar: '/api/placeholder/32/32',
    unread: 1,
    isOnline: true
  },
  {
    id: 8,
    name: 'Victor Olson',
    message: 'Hi, just letting you know that the...',
    time: 'Wed',
    avatar: '/api/placeholder/32/32',
    unread: 0,
    isOnline: false
  }
];

const chatMessages = [
  {
    id: 1,
    sender: 'Edwin Johnson',
    message: 'Hi! I\'m interested in the apartment listing I saw online. Is it still available for next weekend?',
    time: '8:01',
    isMe: false,
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 2,
    message: 'Hi there! Yes, it\'s available on those dates. Just to confirm, you\'re looking for check-in next Saturday or Sunday?',
    time: '8:01',
    isMe: true
  },
  {
    id: 3,
    sender: 'Edwin Johnson',
    message: 'We\'re looking for a place with a nice view or a cozy balcony, if possible.',
    time: '8:04',
    isMe: false,
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 4,
    sender: 'Edwin Johnson',
    message: 'It\'ll be me and one friend.',
    time: '8:06',
    isMe: false,
    avatar: '/api/placeholder/32/32'
  },
  {
    id: 5,
    message: 'Great! The apartment has a small balcony with a view of the city—perfect for morning coffee! ☕',
    time: '8:07',
    isMe: true,
    image: '/api/placeholder/400/300'
  },
  {
    id: 6,
    sender: 'Edwin Johnson',
    message: 'Cool! Is there a coffee machine or kettle in the kitchen?',
    time: '8:09',
    isMe: false,
    avatar: '/api/placeholder/32/32'
  }
];

export default function MessagingUI() {
  const [selectedChat, setSelectedChat] = useState(messages[2]);
  const [messageInput, setMessageInput] = useState('');

  return (
    <div className="flex bg-white" style={{height:"calc(100vh - 64px)"}}>
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </div>
          
          {/* Filter tabs */}
          <div className="flex gap-2">
            <Badge 
              variant="secondary" 
              className="bg-[oklch(71.4%_0.203_305.504)] text-white hover:bg-[oklch(71.4%_0.203_305.504)]/90 px-4 py-1"
            >
              General 6
            </Badge>
            <Badge variant="outline" className="px-4 py-1">
              Archive 2
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedChat.id === msg.id ? 'bg-gray-50' : ''
              }`}
              onClick={() => setSelectedChat(msg)}
            >
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={msg.avatar} alt={msg.name} />
                  <AvatarFallback>{msg.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {msg.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate">{msg.name}</h3>
                  <span className="text-sm text-gray-500">{msg.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{msg.message}</p>
              </div>
              
              {msg.unread > 0 && (
                <Badge className="bg-[oklch(71.4%_0.203_305.504)] text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                  {msg.unread}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/api/placeholder/32/32" alt="Edwin Johnson" />
              <AvatarFallback>EJ</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium text-gray-900">Edwin Johnson</h2>
              <p className="text-sm text-gray-500">1-Bedroom Apartment, 45 m² • $80/night</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} gap-2`}>
              {!msg.isMe && (
                <Avatar className="w-6 h-6 mt-1">
                  <AvatarImage src={msg.avatar} alt={msg.sender} />
                  <AvatarFallback className="text-xs">{msg.sender?.[0]}</AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-xs lg:max-w-md ${msg.isMe ? 'order-1' : ''}`}>
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    msg.isMe
                      ? 'bg-[oklch(71.4%_0.203_305.504)] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  {msg.image && (
                    <div className="mt-2 rounded-lg overflow-hidden">
                      <img 
                        src={msg.image} 
                        alt="Apartment view" 
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message input - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                placeholder="Your message"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="pr-20"
              />
            </div>
            
            <div className="flex gap-1">
              <Button variant="ghost" size="sm">
                <Mic className="w-4 h-4" />
              </Button>
              
              <Button 
                size="sm" 
                className="bg-[oklch(71.4%_0.203_305.504)] hover:bg-[oklch(71.4%_0.203_305.504)]/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}