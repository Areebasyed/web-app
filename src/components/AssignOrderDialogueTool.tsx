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
import { useTheme } from 'next-themes';

interface Tool {
  name: string;
  quantity: number;
  rentalPricePerTool: number;
}

interface AssignOrderToolDialogProps {
  gig: {
    _id: Id<"sellerGigs">;
    userId: Id<"users">;
    toolService?: Tool[];
  };
  buyerId: Id<"users">;
}

export function AssignOrderToolDialog({ gig, buyerId }: AssignOrderToolDialogProps) {
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<Array<{ tool: Tool; quantity: number }>>([]);

  const { toast } = useToast();
  const { theme } = useTheme();
  const tools = gig.toolService || [];

  const assignToolOrderRequest = useMutation(api.orders.assignToolOrderRequest);

  const handleAddItem = () => {
    const tool = tools.find(t => t.name === selectedTool);
    if (tool && quantity > 0 && quantity <= tool.quantity) {
      setOrderItems([...orderItems, { tool, quantity }]);
      setSelectedTool('');
      setQuantity(0);
    } else {
      toast({
        title: "Invalid Quantity",
        description: "Please select a valid quantity within the available range.",
        variant: "destructive",
      });
    }
  };

  const calculateTotalBill = () => {
    return orderItems.reduce((total, item) => total + (item.tool.rentalPricePerTool * item.quantity), 0);
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
      await assignToolOrderRequest({
        gigId: gig._id,
        buyerId,
        sellerId: gig.userId,
        orderItems: orderItems.map(item => ({
          toolName: item.tool.name,
          quantity: item.quantity,
          price: item.tool.rentalPricePerTool
        })),
        paymentMethod: paymentMethod as "cash" | "card",
        amount: calculateTotalBill(),
        isCustom: true
      });

      toast({
        title: "Request Sent",
        description: "Your tool rental request has been sent to the seller.",
      });
      setIsDialogOpen(false);
      setOrderItems([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send rental request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4">Rent Tools</Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[425px] ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <DialogHeader>
          <DialogTitle>Tool Rental Request</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tool" className="text-right">
              Tool
            </Label>
            <Select value={selectedTool} onValueChange={setSelectedTool}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Tool" />
              </SelectTrigger>
              <SelectContent>
                {tools.map((tool) => (
                  <SelectItem key={tool.name} value={tool.name}>
                    {tool.name} (${tool.rentalPricePerTool}/tool)
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
              // min="1"
              // max={tools.find(t => t.name === selectedTool)?.quantity || 1}
              value={quantity}
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
                  {item.tool.name}: {item.quantity} tools 
                  (${item.tool.rentalPricePerTool * item.quantity})
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
        <Button onClick={handleSubmit}>Send Rental Request to Seller</Button>
      </DialogContent>
    </Dialog>
  );
}