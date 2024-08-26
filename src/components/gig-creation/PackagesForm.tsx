// components/gig-creation/PackagesForm.tsx
'use client'

import { useState } from 'react'
import { useGigStore } from '@/store/useGigStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function PackagesForm() {
  const [pkg, setPkg] = useState({
    name: '',
    teamSize: 0,
    resourceCount: 0,
    toolCount: 0,
    budget: 0,
    deliveryTime: 0
  })
  const { addPackage, packages } = useGigStore()

  const handleAddPackage = () => {
    addPackage(pkg)
    setPkg({
      name: '',
      teamSize: 0,
      resourceCount: 0,
      toolCount: 0,
      budget: 0,
      deliveryTime: 0
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Packages</h2>
      <div>
        <Label htmlFor="name">Package Name</Label>
        <Input
          id="name"
          value={pkg.name}
          onChange={(e) => setPkg({ ...pkg, name: e.target.value })}
          placeholder="e.g., Basic, Standard, Premium"
        />
      </div>
      <div>
        <Label htmlFor="teamSize">Team Size</Label>
        <Input
          id="teamSize"
          type="number"
          value={pkg.teamSize}
          onChange={(e) => setPkg({ ...pkg, teamSize: parseInt(e.target.value) || 0 })}
          placeholder="Number of team members"
        />
      </div>
      <div>
        <Label htmlFor="resourceCount">Resources Provide to this contract</Label>
        <Input
          id="resourceCount"
          type="number"
          value={pkg.resourceCount}
          onChange={(e) => setPkg({ ...pkg, resourceCount: parseInt(e.target.value) || 0 })}
          placeholder="Number of resources included"
        />
      </div>
      <div>
        <Label htmlFor="toolCount">Tools Provide to this contract</Label>
        <Input
          id="toolCount"
          type="number"
          value={pkg.toolCount}
          onChange={(e) => setPkg({ ...pkg, toolCount: parseInt(e.target.value) || 0 })}
          placeholder="Number of tools included"
        />
      </div>
      <div>
        <Label htmlFor="budget">Budget in your currency</Label>
        <Input
          id="budget"
          type="number"
          value={pkg.budget}
          onChange={(e) => setPkg({ ...pkg, budget: parseFloat(e.target.value) || 0 })}
          placeholder="Package price in your currency"
        />
      </div>
      <div>
        <Label htmlFor="deliveryTime">Delivery Time in Days</Label>
        <Input
          id="deliveryTime"
          type="number"
          value={pkg.deliveryTime}
          onChange={(e) => setPkg({ ...pkg, deliveryTime: parseInt(e.target.value) || 0 })}
          placeholder="Number of days to deliver"
        />
      </div>
      <Button onClick={handleAddPackage}>Add Package</Button>

      {packages.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">Added Packages:</h3>
          <ul className="list-disc pl-5">
            {packages.map((p, index) => (
              <li key={index}>{p.name} - ${p.budget}, {p.deliveryTime} days</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}