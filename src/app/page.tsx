import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, UserCheck, MessageSquare, Award, Users, Mail, Phone, MapPin, ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import TutorRegistrationForm from "@/components/tutor-registration-form";
import  StudentEnrollmentForm from "@/components/student-enrollment-form";
import { Faq } from "@/components/faq";
import  ContactForm  from "@/components/contact-form";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-tutoring');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full h-[60vh] md:h-[80vh]">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-primary/70" />
          <div className="relative container mx-auto flex flex-col items-center justify-center h-full text-center text-primary-foreground p-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
              Personalized Home Tutoring for Academic Excellence
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90">
              Kaushaly Home Learning provides dedicated, one-on-one home tutoring to help students achieve academic excellence.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <a href="#students">Find a Tutor</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary">
                <a href="#tutors">Become a Tutor</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <Award className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold font-headline">Expert Tutors</h3>
                <p className="text-muted-foreground mt-2">Learn from verified experts in their fields.</p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold font-headline">Personalized Learning</h3>
                <p className="text-muted-foreground mt-2">Customized lesson plans to fit your unique learning style.</p>
              </div>
              <div className="flex flex-col items-center">
                <BookOpen className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold font-headline">Wide Range of Subjects</h3>
                <p className="text-muted-foreground mt-2">From math and science to languages and arts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tutor Registration Section */}
        <section id="tutors" className="py-16 md:py-24">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Share Your Knowledge</h2>
              <p className="text-lg text-muted-foreground mt-2">
                Join our community of passionate educators and make a real impact. We provide the platform, you provide the expertise.
              </p>
            </div>
            <Collapsible className="max-w-3xl mx-auto">
              <CollapsibleTrigger asChild>
                <div className="flex justify-center">
                    <Button variant="outline" className="w-full md:w-auto">
                        <UserCheck className="mr-2 h-4 w-4" />
                        Register as a Tutor
                        <ChevronDown className="ml-2 h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                    </Button>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="shadow-lg mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserCheck /> Tutor Registration</CardTitle>
                    <CardDescription>Fill out the form below to start your journey as a tutor.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TutorRegistrationForm />
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </section>

        {/* Student Enrollment Section */}
        <section id="students" className="py-16 md:py-24 bg-card">
           <div className="container mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Start Your Learning Journey</h2>
              <p className="text-lg text-muted-foreground mt-2">
                Get personalized help to conquer your academic goals. Our expert tutors are here to guide you every step of the way.
              </p>
            </div>
            <Collapsible className="max-w-3xl mx-auto">
              <CollapsibleTrigger asChild>
                <div className="flex justify-center">
                    <Button className="w-full md:w-auto">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Enroll as a Student
                        <ChevronDown className="ml-2 h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                    </Button>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="shadow-lg mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookOpen /> Student Enrollment</CardTitle>
                    <CardDescription>Ready to excel? Enroll today and get matched with the perfect tutor.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <StudentEnrollmentForm />
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section id="faq" className="py-16 md:py-24">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-8">Frequently Asked Questions</h2>
            <Faq />
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Get in Touch</h2>
            <div className="grid md:grid-cols-5 gap-12">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold font-headline">Contact Information</h3>
                <p className="text-muted-foreground mt-2 mb-6">Have questions? We'd love to hear from you. Reach out to us directly or send a message using the form.</p>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <Mail className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h4 className="font-semibold">Email</h4>
                            <a href="mailto:contact@kaushaly.in" className="text-muted-foreground hover:text-primary transition-colors">contact@kaushaly.in</a>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Phone className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h4 className="font-semibold">Phone</h4>
                            <p className="text-muted-foreground">+91 94072 72540</p>
                        </div>
                    </div>
                    {/* <div className="flex items-start gap-3">
                        <MapPin className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h4 className="font-semibold">Address</h4>
                            <p className="text-muted-foreground">213 </p>
                        </div>
                    </div> */}
                </div>
              </div>
              <div className="md:col-span-3">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MessageSquare /> Send a Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ContactForm />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
