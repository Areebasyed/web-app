import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send, X } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { useMe } from '@/store/useME';

interface ChatPopupProps {
  gigChatId: Id<'chat'>;
  sellerName: string;
  sellerProfileImage: string;
  isSellerOnline:boolean
}



export function ChatPopup({ gigChatId, sellerName, sellerProfileImage,isSellerOnline }: ChatPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messages = useQuery(api.message.getAllMessagesPerChat, { chatId: gigChatId });
  const sendMessage = useMutation(api.chat.sendMessage);
  const { me } = useMe();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage({ chatId: gigChatId, content: newMessage, userId: me?._id! });
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
         <Button
         onClick={() => setIsOpen(true)}
         className="flex items-center space-x-2 rounded-full pr-4 pl-1 py-1 bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
       >
         <div className="relative">
           <Avatar className="h-10 w-10">
             <AvatarImage src={sellerProfileImage} alt={sellerName} />
             <AvatarFallback>{sellerName?.charAt(0)}</AvatarFallback>
           </Avatar>
           <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${isSellerOnline ? 'bg-green-400' : 'bg-gray-300'}`} />
         </div>
         <span className="font-medium text-sm text-gray-700">{sellerName}</span>
         <MessageCircle className="h-5 w-5 text-gray-500 ml-2" />
       </Button>
      )}
      {isOpen && (
        <div ref={popupRef}>
          <Card className="w-[90vw] sm:w-[350px] h-[70vh] sm:h-[500px] max-h-[600px] flex flex-col shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src={sellerProfileImage} alt={sellerName} />
                  <AvatarFallback>{sellerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-base sm:text-lg font-semibold">{sellerName}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-4">
              <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages?.map((message) => (
                    <div
                      key={message?._id}
                      className={`flex ${
                        message?.userId === me?._id ? 'justify-end' : 'justify-start'
                      } items-end space-x-2`}
                    >
                      {message?.userId !== me?._id && (
                        <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                          <AvatarImage src={sellerProfileImage} alt={sellerName} />
                          <AvatarFallback>{sellerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[70%] p-2 sm:p-3 rounded-lg ${
                          message?.userId === me?._id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-xs sm:text-sm">{message.content}</p>
                      </div>
                      {message?.userId === me?._id && (
                        <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                          <AvatarImage src={me.profileImage} alt={me.name} />
                          <AvatarFallback>{me.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-3 sm:p-4">
              <div className="flex w-full items-center space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-grow text-xs sm:text-sm"
                />
                <Button onClick={handleSendMessage} size="icon" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full">
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}