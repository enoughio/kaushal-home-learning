import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Placeholder: No form logic, just UI
const NewAssignmentDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
        </DialogHeader>
        {/* Form fields would go here */}
        <div className="text-muted-foreground py-4">
          Assignment creation form coming soon...
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewAssignmentDialog;
