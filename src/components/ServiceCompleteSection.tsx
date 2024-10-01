import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface CompleteService {
    teamMembers: {
      name: string;
      experience: number;
    }[],
    resources: {
        name: string;
        quantity: number;
        unit: string;
        pricePerResource: number;
        imageId?: Id<"_storage">;
    }[];
    tools: {
        name: string;
        quantity: number;
        rentalPricePerTool: number;
        imageId?: Id<"_storage">;
    }[];
    packages: {
        name: string;
        teamSize: number;
        resourceCount: number;
        toolCount: number;
        budget: number;
        deliveryTime: number;
    }[];
} 


interface ServiceCompleteSectionProps {
  completeService: CompleteService | undefined;
}

const ResourceCard = ({ resource }: { resource: { name: string, quantity: number, unit: string, pricePerResource: number, imageId?: Id<"_storage"> } }) => {
  const imageUrl = useQuery(api.files.getImageUrl, { 
    imageId: resource.imageId as Id<"_storage"> 
  });

  return (
    <Card className="h-full">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{resource.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {imageUrl && (
          <img src={imageUrl} alt={resource.name} className="object-cover mb-4 rounded-md" />
        )}
        <p className="text-sm">Quantity: {resource.quantity} {resource.unit}</p>
        <p className="text-sm">Price: ${resource.pricePerResource}/{resource.unit}</p>
      </CardContent>
    </Card>
  );
};

const ToolCard = ({ tool }: { tool: { name: string, quantity: number, rentalPricePerTool: number, imageId?: Id<"_storage"> } }) => {
  const imageUrl = useQuery(api.files.getImageUrl, { 
    imageId: tool.imageId as Id<"_storage"> 
  });

  return (
    <Card className="h-full">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{tool.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {imageUrl && (
          <img src={imageUrl} alt={tool.name} className="object-cover mb-4 rounded-md" />
        )}
        <p className="text-sm">Quantity: {tool.quantity}</p>
        <p className="text-sm">Rental Price: ${tool.rentalPricePerTool}/tool</p>
      </CardContent>
    </Card>
  );
};

export const ServiceCompleteSection: React.FC<ServiceCompleteSectionProps> = ({ completeService }) => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Team Members</h2>
        <div className="flex flex-wrap gap-4">
          {completeService?.teamMembers.map((member, index) => (
          
          
            <Card key={index} className="h-full">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{member.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm">Experience: {member.experience} years</p>
              </CardContent>
            </Card>
        ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completeService?.resources.map((resource, index) => (
            <ResourceCard key={index} resource={resource} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completeService?.tools.map((tool, index) => (
            <ToolCard key={index} tool={tool} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completeService?.packages.map((pkg, index) => (
            <Card key={index} className="h-full">
              <CardHeader className="p-4">
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p><Badge variant="outline">{pkg.teamSize} Team Members</Badge></p>
                  <p><Badge variant="outline">{pkg.resourceCount} Resources</Badge></p>
                  <p><Badge variant="outline">{pkg.toolCount} Tools</Badge></p>
                  <p className="text-lg font-semibold">Budget: ${pkg.budget}</p>
                  <p>Delivery Time: {pkg.deliveryTime} days</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};