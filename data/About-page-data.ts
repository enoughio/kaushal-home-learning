export const startingText = `At Kaushaly, we believe that the best learning happens where comfort meets curiosity — at home. Our platform connects passionate educators with eager learners, creating personalized educational experiences that adapt to every individual's pace and style.

Founded on the principle that quality education should be accessible to all, we've built a community where knowledge flows freely, skills are nurtured with care, and every lesson is a step toward a brighter future.`;

export const textAfterValues = `These values aren't just words on a page — they're the foundation of every interaction, every lesson, and every success story that unfolds within our learning community.

When you choose Kaushaly, you're not just selecting a tutoring service; you're joining a movement that believes in the transformative power of education delivered with heart, expertise, and unwavering commitment to your growth.`;

interface ValueCard {
  number: string;
  alignment: 'left' | 'right';
  heading: string;
  text: string;
}

export const valueCards: ValueCard[] = [
  {
    number: "01",
    alignment: "left",
    heading: "Personalized Learning",
    text: "Every learner is unique. We tailor our approach to match individual learning styles, pace, and goals, ensuring that education feels personal and relevant."
  },
  {
    number: "02", 
    alignment: "right",
    heading: "Excellence in Teaching",
    text: "Our educators are not just experts in their fields — they're passionate about sharing knowledge and committed to helping every student reach their full potential."
  },
  {
    number: "03",
    alignment: "left", 
    heading: "Accessibility First",
    text: "Quality education shouldn't be a privilege. We're dedicated to making exceptional learning experiences accessible to students across India, regardless of their background."
  },
  {
    number: "04",
    alignment: "right",
    heading: "Community & Growth",
    text: "Learning thrives in community. We foster an environment where students, teachers, and families grow together, supporting each other's educational journey."
  }
];