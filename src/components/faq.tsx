import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I become a tutor?",
    answer:
      "To become a tutor, simply fill out the tutor registration form on our website. We'll review your application and get in touch with you for the next steps, which may include a background check and a subject matter interview.",
  },
  {
    question: "What subjects are available for tutoring?",
    answer:
      "We offer a wide range of subjects across various academic levels, including Math, Science, English, History, foreign languages, and test preparation for exams like the SAT and ACT. If you have a specific need, please let us know in the student enrollment form.",
  },
  {
    question: "How are tutors vetted?",
    answer:
      "Our tutors go through a rigorous vetting process. This includes a detailed application, verification of academic credentials, a subject proficiency test, and a background check to ensure a safe and high-quality learning environment.",
  },
  {
    question: "What is the pricing for tutoring sessions?",
    answer:
      "Pricing varies depending on the subject, level, and tutor's experience. Once you enroll as a student and specify your needs, we will provide you with a tailored quote and a list of suitable tutors.",
  },
  {
    question: "Can I choose my own tutor?",
    answer:
      "Yes! After you enroll, we will suggest a few tutors that match your requirements. You can review their profiles and even have a short introductory call to find the best fit for your learning style.",
  },
];

export function Faq() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem value={`item-${index}`} key={index}>
          <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground">{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
