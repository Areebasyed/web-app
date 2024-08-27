// components/Header.tsx
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Auth from './Auth'
import { ModeToggle } from './Theme-toggle'
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useRouter, usePathname } from 'next/navigation';
import { useMe } from '@/store/useME';
import NotificationBell from './NotificationBell'
import { Menu } from 'lucide-react'
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const path = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.getMe, isAuthenticated ? undefined : 'skip');
  const { setSelectedMe } = useMe();
  
  const makeUserSeller = useMutation(api.users.updateUserStatusAsSeller);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (user) {
      setSelectedMe(user)
    }
  }, [user, setSelectedMe])

  const handleModeToggle = async (checked: boolean) => {
    if (user) {
      await makeUserSeller({ toggle: checked });
      if (path !== "/") {
        router.replace("/");
        router.refresh();
      }
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image className="h-8 w-8 object-cover rounded-full" width={6} height={6} src="/logo.png" alt="logo buidxpert" />
            <span className='hidden md:flex text-sm font-bold'>BUILD X</span>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && user && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="seller-mode"
                    checked={user.Asseller}
                    onCheckedChange={handleModeToggle}
                  />
                  <Label htmlFor="seller-mode" className="text-sm font-medium">Seller Mode</Label>
                </div>
              )}
             
            </div>
            {isAuthenticated && <NotificationBell />}
              <ModeToggle />
              <Auth />

            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Menu className="h-6 w-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isAuthenticated && user && (
                  <DropdownMenuItem>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="seller-mode-mobile"
                        checked={user.Asseller}
                        onCheckedChange={handleModeToggle}
                      />
                      <Label htmlFor="seller-mode-mobile" className="text-sm">Seller Mode</Label>
                    </div>
                  </DropdownMenuItem>
                )}
               
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header