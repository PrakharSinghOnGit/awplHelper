"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Save, Trash2 } from "lucide-react";
import { TeamMember } from "./EditTeam";

type EditMemberProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
  onSave: (
    member: Partial<TeamMember> & { id?: string },
    isNew: boolean
  ) => void;
  onDelete: (id: string) => void;
};

export function EditMember({
  open,
  onOpenChange,
  member,
  onSave,
  onDelete,
}: EditMemberProps) {
  const isNew = !member;
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: member?.name || "",
    awpl_id: member?.awpl_id || "",
    awpl_pass: member?.awpl_pass || "",
    levelSao: member?.levelSao || 0,
    levelSgo: member?.levelSgo || 0,
    targetSao: member?.targetSao || 0,
    targetSgo: member?.targetSgo || 0,
    status_flag: member?.status_flag || "active",
  });

  // Update form data when member changes
  useEffect(() => {
    setFormData({
      name: member?.name || "",
      awpl_id: member?.awpl_id || "",
      awpl_pass: member?.awpl_pass || "",
      levelSao: member?.levelSao || 0,
      levelSgo: member?.levelSgo || 0,
      targetSao: member?.targetSao || 0,
      targetSgo: member?.targetSgo || 0,
      status_flag: member?.status_flag || "active",
    });
  }, [member]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      {
        ...(member?.id ? { id: member.id } : {}),
        name: formData.name.trim() || null,
        awpl_id: formData.awpl_id.trim().toUpperCase(),
        awpl_pass: formData.awpl_pass.trim() || null,
      },
      isNew
    );
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (member?.id) {
      onDelete(member.id);
      setConfirmDeleteOpen(false);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>
                {isNew ? "Add New Member" : "Edit Member"}
              </DialogTitle>
              <DialogDescription>
                Make sure the AWPL ID and password are correct for data
                fetching.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter member name..."
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="awpl_id" className="text-right">
                  AWPL ID
                </Label>
                <Input
                  id="awpl_id"
                  value={formData.awpl_id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      awpl_id: e.target.value,
                    }))
                  }
                  placeholder="Enter AWPL ID..."
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="awpl_pass" className="text-right">
                  Password
                </Label>
                <Input
                  id="awpl_pass"
                  type="password"
                  value={formData.awpl_pass}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      awpl_pass: e.target.value,
                    }))
                  }
                  placeholder="Enter password..."
                  className="col-span-3"
                  required
                />
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <div className="flex-1">
                {!isNew && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setConfirmDeleteOpen(true)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="gap-2">
                  {isNew ? (
                    <Plus className="h-4 w-4" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isNew ? "Add Member" : "Save Changes"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {member?.name}? This action cannot
              be undone. The member will be removed from your team.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
