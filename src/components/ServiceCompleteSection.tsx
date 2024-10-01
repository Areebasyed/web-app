import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Carousel from './ImageCarousel'


interface CompleteService {
    teamMembers: {
      name: string;
      experience: number;
      
    }[],
    serviceImages: Id<"_storage">[],
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
    <Card className="h-full transition-shadow hover:shadow-lg dark:hover:shadow-slate-700">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold">{resource.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {imageUrl && (
          <img src={imageUrl} alt={resource.name} className="w-full h-40 object-cover mb-4 rounded-md" />
        )}
        <p className="text-sm text-gray-600 dark:text-gray-300">Quantity: {resource.quantity} {resource.unit}</p>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Price: ${resource.pricePerResource}/{resource.unit}</p>
      </CardContent>
    </Card>
  );
};

const ToolCard = ({ tool }: { tool: { name: string, quantity: number, rentalPricePerTool: number, imageId?: Id<"_storage"> } }) => {
  const imageUrl = useQuery(api.files.getImageUrl, { 
    imageId: tool.imageId as Id<"_storage"> 
  });

  return (
    <Card className="h-full transition-shadow hover:shadow-lg dark:hover:shadow-slate-700">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold">{tool.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {imageUrl && (
          <img src={imageUrl} alt={tool.name} className="w-full h-40 object-cover mb-4 rounded-md" />
        )}
        <p className="text-sm text-gray-600 dark:text-gray-300">Quantity: {tool.quantity}</p>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Rental Price: ${tool.rentalPricePerTool}/tool</p>
      </CardContent>
    </Card>
  );
};

export const ServiceCompleteSection: React.FC<ServiceCompleteSectionProps> = ({ completeService }) => {
  if (!completeService) return null;

  return (
    <div className="space-y-12 p-4 bg-gray-50 dark:bg-gray-900">
      <section>
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Service Images</h2>
        <Carousel imageIds={completeService.serviceImages} />
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Team Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {completeService.teamMembers.map((member, index) => (
            <Card key={index} className="transition-shadow hover:shadow-lg dark:hover:shadow-slate-700">
              <CardHeader className="p-4">
                <CardTitle className="text-xl font-semibold">{member.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">Experience: {member.experience} years</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {completeService.resources.map((resource, index) => (
            <ResourceCard key={index} resource={resource} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {completeService.tools.map((tool, index) => (
            <ToolCard key={index} tool={tool} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {completeService.packages.map((pkg, index) => (
            <Card key={index} className="transition-shadow hover:shadow-lg dark:hover:shadow-slate-700">
              <CardHeader className="p-4">
                <CardTitle className="text-2xl font-semibold">{pkg.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Badge variant="outline" className="text-sm">{pkg.teamSize} Team Members</Badge>
                  <Badge variant="outline" className="text-sm">{pkg.resourceCount} Resources</Badge>
                  <Badge variant="outline" className="text-sm">{pkg.toolCount} Tools</Badge>
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-200">Budget: ${pkg.budget}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Delivery Time: {pkg.deliveryTime} days</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};