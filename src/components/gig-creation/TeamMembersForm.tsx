
'use client'

import { useState } from 'react'
import { useGigStore } from '@/store/useGigStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Plus } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

interface Membor {
  name: string
  experience: number
}

export default function TeamMembersForm() {
  const [newMember, setNewMember] = useState<Membor>({name:'',experience:0});
  const { teamMembers, setTeamMembers } = useGigStore()
  const { toast } = useToast()

  const handleAddMember = (newMembor: Membor) => {
    if (newMember.name && newMember.experience) {
      setTeamMembers([...teamMembers, newMember])
      setNewMember({name: '', experience: 0})
      toast({
        title: "Team member added",
        description: `${newMember.name} has been added to the team.`,
      })
    }
  }

  const handleRemoveMember = (index: number) => {
    const updatedMembers = teamMembers.filter((_, i) => i !== index)
    setTeamMembers(updatedMembers)
    toast({
      title: "Team member removed",
      description: "A team member has been removed from the list.",
    })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Team Members</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-end space-x-2">
          <div className="flex-grow">
            <Label htmlFor="newMember">New Team Member name</Label>
            <Input
              id="newMember"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              placeholder="Enter team member name"
            />
          </div>

          <div className='flex-grow'>
          <Label htmlFor="newMember">Add experience in years</Label>
            <Input
              id="experience"
              min={0}
              type="number"
              value={newMember.experience}
              onChange={(e) => setNewMember({ ...newMember, experience: Number(e.target.value) })}
              placeholder="Enter team member name"
            />
          </div>
          </div>
          <Button onClick={() => handleAddMember(newMember)}>
            <Plus className="mr-2 h-4 w-4" /> Add Member
          </Button>
        
        {teamMembers.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member, index) => (
                <TableRow key={index}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}