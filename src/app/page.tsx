'use client'
import { Suspense } from 'react';
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import CTA from "@/components/CTA";
import Features from "@/components/features";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItsWork";
import Testimonials from "@/components/Testimonials";
import { Skeleton } from "@/components/ui/skeleton";
import SellerDashboard from '@/components/SellerDashboard';
import BuyerDashboard from '@/components/BuyerDashboard';

export default function Home() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.getMe,isAuthenticated ?undefined:'skip');

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </div>
    );
  }

  
  if (!user) {
    return <LoadingSkeleton />;
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      {user.Asseller ? <SellerDashboard isSeller={user.Asseller} userId={user._id} /> : <BuyerDashboard isSeller={user.Asseller as boolean} userId={user._id} />}
    </Suspense>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}