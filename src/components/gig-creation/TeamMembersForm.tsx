// components/gig-creation/TeamMembersForm.tsx
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

export default function TeamMembersForm() {
  const [newMember, setNewMember] = useState('')
  const { teamMembers, setTeamMembers } = useGigStore()
  const { toast } = useToast()

  const handleAddMember = () => {
    if (newMember.trim()) {
      setTeamMembers([...teamMembers, { name: newMember.trim() }])
      setNewMember('')
      toast({
        title: "Team member added",
        description: `${newMember.trim()} has been added to the team.`,
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
            <Label htmlFor="newMember">New Team Member</Label>
            <Input
              id="newMember"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              placeholder="Enter team member name"
            />
          </div>
          <Button onClick={handleAddMember}>
            <Plus className="mr-2 h-4 w-4" /> Add Member
          </Button>
        </div>

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