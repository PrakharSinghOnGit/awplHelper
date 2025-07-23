"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TeamMember } from "@/types";
import { Plus, Save, Trash2 } from "lucide-react";

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
  const handleSave = (name: string, awpl_id: string, awpl_pass: string) => {
    onSave(
      {
        ...(member?.id ? { id: member.id } : {}),
        awpl_id,
        name,
        awpl_pass,
      },
      isNew
    );
  };

  return (
    <>
      <Drawer onOpenChange={onOpenChange} open={open}>
        <DrawerContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave(
                (document.getElementById("name") as HTMLInputElement).value,
                (document.getElementById("Id") as HTMLInputElement).value,
                (document.getElementById("pass") as HTMLInputElement).value
              );
              onOpenChange(false);
            }}
          >
            <DrawerHeader>
              <DrawerTitle>{isNew ? "Add Member" : "Edit Member"}</DrawerTitle>
              <DrawerDescription>
                Make sure the id and password are correct.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-3 flex flex-col gap-3">
              <div className="flex flex-row">
                <Label className="min-w-[25%]" htmlFor="name">
                  Name :
                </Label>
                <Input
                  id="name"
                  defaultValue={member?.name ?? ""}
                  placeholder="Enter Name..."
                  required
                />
              </div>
              <div className="flex flex-row">
                <Label className="min-w-[25%]" htmlFor="Id">
                  User Id :
                </Label>
                <Input
                  type="text"
                  id="Id"
                  defaultValue={member?.awpl_id ?? ""}
                  placeholder="Enter User Id..."
                  required
                />
              </div>
              <div className="flex flex-row">
                <Label className="min-w-[25%]" htmlFor="pass">
                  Password :
                </Label>
                <Input
                  type="text"
                  id="pass"
                  defaultValue={member?.awpl_pass ?? ""}
                  placeholder="Enter Password..."
                  required
                />
              </div>
            </div>
            <DrawerFooter className="flex justify-end flex-row p-3">
              {!isNew && (
                <Button
                  type="button"
                  className="gap-1"
                  variant="destructive"
                  onClick={() => {
                    setConfirmDeleteOpen(true);
                  }}
                >
                  <Trash2 />
                  Delete
                </Button>
              )}

              <Button variant="default" className="gap-1" type="submit">
                {isNew ? <Plus strokeWidth={3} /> : <Save />}
                {isNew ? "Add" : "Save"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Delete Member"
        description="Are you sure you want to delete this team member? This action cannot be undone."
        onConfirm={() => {
          onOpenChange(false);
          onDelete(member?.id ?? "");
        }}
        confirmText="Delete"
      />
    </>
  );
}