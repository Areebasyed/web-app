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
    <div className="flex flex-col min-h-screen space-y-8 p-4 bg-background">
      <div className="space-y-4">
        <Skeleton className="h-16 w-3/4 max-w-3xl mx-auto" />
        <Skeleton className="h-6 w-2/3 max-w-2xl mx-auto" />
      </div>
      <div className="flex justify-center space-x-4">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-12 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}