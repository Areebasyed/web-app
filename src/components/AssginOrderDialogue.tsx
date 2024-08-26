import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMutation } from 'convex/react';

import { useToast } from "@/components/ui/use-toast";
import { Id } from '../../convex/_generated/dataModel';
import { api } from '../../convex/_generated/api';

interface AssignOrderDialogProps {
  gig: {
    _id: Id<"sellerGigs">;
    userId: Id<"users">;
    completeService?: {
      packages: Array<{
        name: string;
        teamSize: number;
        resourceCount: number;
        toolCount: number;
        budget: number;
        deliveryTime: number;
      }>;
    };
  };
  buyerId: Id<"users">;
}

export function AssignOrderDialog({ gig, buyerId }: AssignOrderDialogProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const { toast } = useToast();
  let packages :string[] = [];
   packages = gig.completeService?.packages.map((p) => p.name) || []; 
 

   const assignContractOrderRequest = useMutation(api.orders.assignContractOrderRequest);
   const handleSubmit = async () => {
    console.log({ selectedPackage, startDate, endDate, paymentMethod });
    if (!selectedPackage || !startDate || !endDate || !paymentMethod) {
      toast({
        title: "Incomplete Form",
        description: "Please fill out all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    const selectedPackageDetails = gig.completeService?.packages.find(pkg => pkg.name === selectedPackage);

    if (!selectedPackageDetails) {
      toast({
        title: "Error",
        description: "Selected package not found.",
        variant: "destructive",
      });
      return;
    }

    try {
      await assignContractOrderRequest({
        gigId: gig._id,
        buyerId,
        sellerId: gig.userId,
        packageName: selectedPackage,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        paymentMethod: paymentMethod as "cash" | "card",
        amount: selectedPackageDetails.budget,
      });

      toast({
        title: "Request Sent",
        description: "Your assignment request has been sent to the seller.",
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send assignment request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4">Assign Order</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Order Request</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="package" className="text-right">
              Package
            </Label>
            
<Select value={selectedPackage} onValueChange={setSelectedPackage}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a Package" />
  </SelectTrigger>
  <SelectContent>
           {packages.map((pkg) => (
              <SelectItem key={pkg} value={pkg}>
                {pkg}
              </SelectItem>
            ))  }
  </SelectContent>
</Select>

          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Start Date</Label>
            <div className="col-span-3">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">End Date</Label>
            <div className="col-span-3">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => date < (startDate || new Date())}
                className="rounded-md border"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Payment</Label>
            <RadioGroup onValueChange={setPaymentMethod} value={paymentMethod} className="col-span-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash">Cash</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <Button onClick={handleSubmit}>Send Approval Request to Seller</Button>
      </DialogContent>
    </Dialog>
  );
}