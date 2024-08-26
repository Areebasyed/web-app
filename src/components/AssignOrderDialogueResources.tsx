import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMutation } from 'convex/react';
import { useToast } from "@/components/ui/use-toast";
import { Id } from '../../convex/_generated/dataModel';
import { api } from '../../convex/_generated/api';

interface Resource {
  name: string;
  quantity: number;
  unit: string;
  pricePerResource: number;
}

interface AssignOrderResourceDialogProps {
  gig: {
    _id: Id<"sellerGigs">;
    userId: Id<"users">;
    resourceService?: Resource[];
  };
  buyerId: Id<"users">;
}

export function AssignOrderResourceDialog({ gig, buyerId }: AssignOrderResourceDialogProps) {
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<Array<{ resource: Resource; quantity: number }>>([]);

  const { toast } = useToast();
  const resources = gig.resourceService || [];

  const assignResourceOrderRequest = useMutation(api.orders.assignResourceOrderRequest);

  const handleAddItem = () => {
    const resource = resources.find(r => r.name === selectedResource);
    if (resource && quantity > 0) {
      setOrderItems([...orderItems, { resource, quantity }]);
      setSelectedResource('');
      setQuantity(0);
    }
  };

  const calculateTotalBill = () => {
    return orderItems.reduce((total, item) => total + (item.resource.pricePerResource * item.quantity), 0);
  };

  const handleSubmit = async () => {
    if (orderItems.length === 0 || !paymentMethod) {
      toast({
        title: "Incomplete Form",
        description: "Please add at least one item and select a payment method.",
        variant: "destructive",
      });
      return;
    }

    try {
      await assignResourceOrderRequest({
        gigId: gig._id,
        buyerId,
        sellerId: gig.userId,
        orderItems: orderItems.map(item => ({
          resourceName: item.resource.name,
          quantity: item.quantity,
          price: item.resource.pricePerResource
        })),
        paymentMethod: paymentMethod as "cash" | "card",
        amount: calculateTotalBill(),
        isCustom: true
      });

      toast({
        title: "Request Sent",
        description: "Your resource order request has been sent to the seller.",
      });
      setIsDialogOpen(false);
      setOrderItems([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send order request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4">Order Resources</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Resource Order Request</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resource" className="text-right">
              Resource
            </Label>
            <Select value={selectedResource} onValueChange={setSelectedResource}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Resource" />
              </SelectTrigger>
              <SelectContent>
                {resources.map((resource) => (
                  <SelectItem key={resource.name} value={resource.name}>
                    {resource.name} (${resource.pricePerResource}/{resource.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              min="1"
              max={resources.find(r => r.name === selectedResource)?.quantity || 1}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <Button onClick={handleAddItem}>Add to Order</Button>
          
          {orderItems.length > 0 && (
            <div>
              <h3 className="font-bold mt-4 mb-2">Order Summary:</h3>
              {orderItems.map((item, index) => (
                <p key={index}>
                  {item.resource.name}: {item.quantity} {item.resource.unit} 
                  (${item.resource.pricePerResource * item.quantity})
                </p>
              ))}
              <p className="font-bold mt-2">Total: ${calculateTotalBill()}</p>
            </div>
          )}

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
        <Button onClick={handleSubmit}>Send Order Request to Seller</Button>
      </DialogContent>
    </Dialog>
  );
}