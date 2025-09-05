const googleScriptURLTeacher = "YOUR_TEACHER_SCRIPT_URL"
const googleScriptURLStudent = "https://script.google.com/macros/s/AKfycbxgPoVY5mUqzjP7D8VXWAFYOM92zNXZebgBqj2ffLoKjE3JMsmVgwfGHaE0G-RRCBmx/exec"

export const addTeacher = async (formData) => {
  const payload = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    address: formData.get("address"),
    resume: formData.get("resume"),
    subjects: formData.get("subjects"), // can be array, join(",")
    location: formData.get("location"),
    experience: formData.get("experience"),
    availability: formData.get("availability"),
  };

  try {
    const res = await fetch(googleScriptURLTeacher, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (text === "success") {
      return { successMessage: "✅ Teacher application submitted." };
    }
    throw new Error(text);
  } catch (error) {
    return { errorMessage: "❌ Error submitting teacher application." };
  }
};

export const addStudent = async (formData) => {
  const payload = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    address: formData.get("address"),
    resume: formData.get("resume"),
    subjects: formData.get("subjects"),
    location: formData.get("location"),
    grade: formData.get("grade"),
    learningMode: formData.get("learningMode"),
  };

  try {
    const res = await fetch(googleScriptURLStudent, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (text === "success") {
      return { successMessage: "✅ Student application submitted." };
    }
    throw new Error(text);
  } catch (error) {
    return { errorMessage: "❌ Error submitting student application." };
  }
};
