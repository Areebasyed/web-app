import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { toast } from '@/components/ui/use-toast'
import { Id } from '../../convex/_generated/dataModel'

export type ServiceType = 'complete' | 'resources' | 'tools'

interface TeamMember {
  name: string
}

interface Resource {
  name: string
  quantity: number
  unit: string
  pricePerResource: number
  imageId?: Id<"_storage">
}

interface Tool {
  name: string
  quantity: number
  rentalPricePerTool: number
  imageId?: Id<"_storage">
  
}

interface Package {
  name: string
  teamSize: number
  resourceCount: number
  toolCount: number
  budget: number
  deliveryTime: number
}

interface BasicInfo {
  title: string
  location: string
  description: string
  serviceType: ServiceType
}

interface GigState {
  basicInfo: BasicInfo
  teamMembers: TeamMember[]
  resources: Resource[]
  tools: Tool[]
  packages: Package[]
  currentStep: number
}

interface GigActions {
  setBasicInfo: (info: Partial<BasicInfo>) => void
  setTeamMembers: (members: TeamMember[]) => void
  addResource: (resource: Resource) => void
  removeResource: (name: string) => void
  addTool: (tool: Tool) => void
  removeTool: (name: string) => void
  addPackage: (pkg: Package) => void
  removePackage: (name: string) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
  submitGig: () => GigSubmissionData
}

const initialState: GigState = {
  basicInfo: {
    title: '',
    description: '',
    location: '',
    serviceType: 'complete',
  },
  teamMembers: [],
  resources: [],
  tools: [],
  packages: [],
  currentStep: 1,
}

export interface GigSubmissionData {
  userId: Id<"users">
  title: string
  description: string
  location: string
  serviceType: ServiceType
  completeService?: {
    teamMembers: string[]
    resources: Resource[]
    tools: Tool[]
    packages: Package[]
  }
  resourceService?: Resource[]
  toolService?: Tool[]
 
}

export const useGigStore = create<GigState & GigActions>()(
  subscribeWithSelector(
    devtools((set, get) => ({
      ...initialState,
      setBasicInfo: (info) =>
        set((state) => ({
          basicInfo: { ...state.basicInfo, ...info },
        })),
      setTeamMembers: (members) => {
        set({ teamMembers: members })
        toast({ title: 'Team members saved', description: 'Your team members have been updated.' })
      },
      addResource: (resource) => {
        set((state) => ({
          resources: [...state.resources, resource],
        }))
        toast({ title: 'Resource added', description: 'New resource has been added to your gig.' })
      },
      removeResource: (name) =>
        set((state) => ({
          resources: state.resources.filter((r) => r.name !== name),
        })),
      addTool: (tool) => {
        set((state) => ({
          tools: [...state.tools, tool],
        }))
        toast({ title: 'Tool added', description: 'New tool has been added to your gig.' })
      },
      removeTool: (name) =>
        set((state) => ({
          tools: state.tools.filter((t) => t.name !== name),
        })),
      addPackage: (pkg) => {
        set((state) => ({
          packages: [...state.packages, pkg],
        }))
        toast({ title: 'Package added', description: 'New package has been added to your gig.' })
      },
      removePackage: (name) =>
        set((state) => ({
          packages: state.packages.filter((p) => p.name !== name),
        })),
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
      reset: () => set(initialState),
      submitGig: () => {
        const state = get()
        const submissionData: GigSubmissionData = {
          userId: 'user-id-here' as any, // "set as dummy add at during submission"
          title: state.basicInfo.title,
          location: state.basicInfo.location,
          description: state.basicInfo.description,
          serviceType: state.basicInfo.serviceType,
         
        }

        if (state.basicInfo.serviceType === 'complete') {
          submissionData.completeService = {
            teamMembers: state.teamMembers.map(member => member.name),
            resources: state.resources,
            tools: state.tools,
            packages: state.packages,
          }
        } else if (state.basicInfo.serviceType === 'resources') {
          submissionData.resourceService = state.resources
        } else if (state.basicInfo.serviceType === 'tools') {
          submissionData.toolService = state.tools
        }

        return submissionData
      },
    }))
  )
)