"use server";

import { z } from "zod";
import { tutorSchema, studentSchema, contactSchema } from "@/app/schemas";



export const enrollStudent = async (formData: FormData) => {
  const googleScriptURLStudent = "https://script.google.com/macros/s/AKfycby7FCIXqmU-TEpBScNsT-x46zo-iwhZzEbo46370FTaHZssc7uoU65C9vhDcdS7Vssq/exec"

  const name = formData.get("name");
  const parentPhone = formData.get("parentPhone");
  const parentEmail = formData.get("parentEmail");
  const gender = formData.get("gender");
  const grade = formData.get("grade");
  const board = formData.get("board");
  const school = formData.get("school");
  const address = formData.get("address");
  const subjects = formData.get("subjects");

  try {
    const res = await fetch(googleScriptURLStudent, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        parentPhone,
        parentEmail,
        gender,
        grade,
        board,
        school,
        address,
        subjects
      })
    });

    if (!res.ok) {
      throw new Error("Failed to add enrollment to google spreadsheet");
    }

    return { successMessage: `Your enrollment has been sent successfully!` };
  } catch (error) {
    return { errorMessage: `There was a problem with your enrollment!` };
  }
};
  

export const sendContactMessage = async (formData: FormData) => {
  const googleScriptURLContact = "https://script.google.com/macros/s/AKfycbwb9Rq7QD9RYg_KEkt4YXFRiFQqP2lVKIT4jZjrirnpvIf5uU1_LiL0UXsx-Q5PUDACaA/exec"

  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const message = formData.get("message");

  try {
    const res = await fetch(googleScriptURLContact, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        message
      })
    });

    if (!res.ok) {
      throw new Error("Failed to add contact message to google spreadsheet");
    }

    return { successMessage: `Your message has been sent successfully!` };
  } catch (error) {
    return { errorMessage: `There was a problem sending your message!` };
  }
};



export const registerTutor = async (formData: FormData) => {
  const googleScriptURLTutor = "https://script.google.com/macros/s/AKfycby3B00_ZlcYKJ2qkLBQLHg_VsovAs7GPL8w3k0TfIfD_xj-XTr3tJ3_rDEyP32mzSE9/exec"; // <-- Replace with your URL

  const name = formData.get("name");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const gender = formData.get("gender");
  const age = formData.get("age");
  const address = formData.get("address");
  const locations = formData.get("locations");
  const education = formData.get("education");
  const marks10 = formData.get("marks10");
  const marks12 = formData.get("marks12");
  const idProof = formData.get("idProof");
  const subjects = formData.get("subjects");

  try {
    const res = await fetch(googleScriptURLTutor, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        phone,
        email,
        gender,
        age,
        address,
        locations,
        education,
        marks10,
        marks12,
        idProof,
        subjects
      })
    });

    if (!res.ok) {
      throw new Error("Failed to add registration to google spreadsheet");
    }

    return { successMessage: `Your registration has been sent successfully!` };
  } catch (error) {
    return { errorMessage: `There was a problem with your registration!` };
  }
};
