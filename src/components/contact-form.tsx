"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { sendContactMessage } from "@/app/actions";
export default function ContactForm() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const result = await sendContactMessage(formData);
      if (!result.successMessage) {
        throw new Error(result.errorMessage || "Failed to submit form");
      }
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormState({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      }, 25000);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || "There was an error submitting your message.");
    }
  };

  return (
    <div className="glass p-8 rounded-lg">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-600">
              <AlertTitle className="text-red-400">Error</AlertTitle>
              <AlertDescription className="text-gray-300">{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
            <Input id="name" name="name" value={formState.name} onChange={handleChange} placeholder="Alex Ray" required className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <Input id="email" name="email" type="email" value={formState.email} onChange={handleChange} placeholder="alex@example.com" required className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</label>
            <Input id="phone" name="phone" value={formState.phone} onChange={handleChange} placeholder="Phone" className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
            <Textarea id="message" name="message" rows={5} value={formState.message} onChange={handleChange} placeholder="Your message here..." required className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                Send Message
              </span>
            )}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
          <p className="text-gray-400 text-center">
            Thank you for reaching out. We'll get back to you within 24 hours.
          </p>
        </div>
      )}
    </div>
  );
}
