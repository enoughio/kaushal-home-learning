// edit and delete an assignment 

import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";
import { AssignmentStatus, UserRole } from "@/generated/prisma";
import { z, ZodError } from "zod";

const assinBodySchema = z
  .object({
    title: z.string(),
    description: z.string(),
    subject: z.string(),
    dueDate: z.string(),
  }).partial();

const idSchema = z.string({ message: "Assignment ID required" }).transform((id) => {
  const parsedId = Number(id);
  if (isNaN(parsedId)) {
    throw new Error("Invalid assignment ID");
  }
  return parsedId;
});

// edit assin
export const PUT = async (req : NextRequest, 
  { params } : { params : Promise<{ assignmentId : string }>   }
) => {
  try {
    

    const user = getAuthUser(req)

    if(!user || user.role != UserRole.teacher){
      return respondWithError({
        error : "FORBIDDEN", 
        message : "Only Teacher can edit an assignment",
        status : 403
      })
    }

    const data = await params;
    const assignmentId  = idSchema.safeParse(data.assignmentId)

    if(!assignmentId.success){
      return respondWithError({
        error : "INVALID_ACTION",
        message : assignmentId.error.message,
        status : 400
      })
    }

    const body = await req.json()
    const parsedBody = assinBodySchema.safeParse(body);

    if (!parsedBody.success) {
      return respondWithError({
        error: "BAD_REQUEST",
        message: "Invalid request body",
        details: parsedBody.error.issues,
        status: 400,
      });
    }

    const updateData = Object.fromEntries(
      Object.entries(parsedBody.data).filter(([, value]) => value !== undefined)
    );

    if (Object.keys(updateData).length === 0) {
      return respondWithError({
        error: "BAD_REQUEST",
        message: "No valid fields provided for update",
        status: 400,
      });
    }

    const oldData = await prisma.assignments.findUnique({
      where: { id: assignmentId.data },
      select : {
        id : true
      }
    });

    if (!oldData) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Assignment not found",
        status: 404,
      });
    }

    const updatedAssignment = await prisma.assignments.update({
      where: { id: assignmentId.data },
      data: updateData,
    });

    return respondWithSuccess({
      message: "Assignment updated successfully",
      data: updatedAssignment,
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof ZodError ? error.message : "An unexpected error occurred";
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: errorMessage,
      status: 500,
    });
  }
}



// delete assignment
export const DELETE = async (req : NextRequest, {
  params } : { params  : Promise<{ assignmentId : string }>}
) => {
  try {  
    const user = getAuthUser(req)

    if(!user || user.role != UserRole.teacher){
      return respondWithError({
        error : "FORBIDDEN", 
        message : "Only Teacher can edit an assignment",
        status : 403
      })
    }

    const data = await params;
    const assignmentId  = idSchema.safeParse(data.assignmentId)

    if(!assignmentId.success){
      return respondWithError({
        error : "INVALID_ACTION",
        message : assignmentId.error.message,
        status : 400
      })
    }

    const response = await prisma.assignments.delete({
      where : { id :  assignmentId.data }
    })

    return respondWithSuccess({
      data : response.id ,
      message : "Assignment Deleted succesfully",
      status : 400
    })

  } catch (error) {
    
    return respondWithError({
      error : "INTERNAL_SERVER_ERROR",
      message : "failed to delete the assignment",
      status : 500
    })
  }
}