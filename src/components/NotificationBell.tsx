import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useQuery, useConvexAuth, useMutation } from 'convex/react';
import { Id } from '../../convex/_generated/dataModel';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '../../convex/_generated/api';
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useTheme } from 'next-themes';
import { useMe } from '@/store/useME';

type Notification = {
  _id: Id<"notifications">;
  notificationType: "order" | "message";
  content: string;
  sendBy: Id<"users">;
  sendTo: Id<"users">;
  _creationTime: number;
  isRead: boolean;
};

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const { me } = useMe();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { theme } = useTheme();

  const notifications = useQuery(
    api.notifications.getNotifications,
    isAuthenticated && me?._id ? { userId: me?._id } : 'skip'
  );

  const markNotificationsAsRead = useMutation(api.notifications.markNotificationsAsRead);

  useEffect(() => {
    if (open && me?._id) {
      markNotificationsAsRead({ userId: me._id });
    }
  }, [open, me?._id, markNotificationsAsRead]);

  if (isLoading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
  };

  const handleCloseDialog = () => {
    setSelectedNotification(null);
  };

  const getButtonClass = (variant: 'default' | 'destructive') => 
    `px-3 py-2 text-sm font-medium rounded-md transition-colors 
    ${variant === 'default' 
      ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
      : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'}`;

  const unreadNotifications = notifications?.filter(n => !n.isRead) ?? [];

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <ScrollArea className="h-[300px]">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`py-2 border-b cursor-pointer transition-colors
                    ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}
                    ${!notification.isRead ? 'font-bold' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <p className="text-sm">{notification.content}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification._creationTime).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No new notifications</p>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <Dialog open={!!selectedNotification} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedNotification?.notificationType === 'order' ? 'Order Notification' : 'Message'}
            </DialogTitle>
          </DialogHeader>
          <p>{selectedNotification?.content}</p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationBell;