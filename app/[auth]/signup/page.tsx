"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, User, UserCheck, ArrowRight, CheckCircle } from "lucide-react"
// import { Badge } from "@/components/ui/badge"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: ''
  })
  const [isVerificationSent, setIsVerificationSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate sending verification email
    setIsVerificationSent(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className=" bg-gradient-to-br min-h-screen from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-2">
        {/* Header */}
        <div className="text-center ">
          <h1 className="text-3xl font-bold text-gray-900">Join Kaushaly</h1>
          <p className="text-gray-600">Create your learning account</p>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-semibold flex items-center leading-none ">
              <User className="h-5 w-5 text-primary" />
              Sign Up
            </CardTitle>
            <CardDescription className='text-sm text-gray-500 '>
              Fill in your details to get started
            </CardDescription>
          </CardHeader>

          <CardContent className="m-0 py-0" >
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* First Name Field */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>

              {/* Last Name Field */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  Role
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Student
                      </div>
                    </SelectItem>
                    <SelectItem value="teacher">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Teacher
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={!formData.email || !formData.firstName || !formData.lastName || !formData.role}
              >
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Email Verification Section */}
        {/* <Card className={`shadow-lg border-0 transition-all duration-300 ${isVerificationSent ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${isVerificationSent ? 'bg-green-100' : 'bg-gray-100'}`}>
                {isVerificationSent ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <Mail className="h-6 w-6 text-gray-400" />
                )}
              </div>
              
              <div>
                <h3 className={`font-semibold ${isVerificationSent ? 'text-green-800' : 'text-gray-700'}`}>
                  {isVerificationSent ? 'Verification Email Sent!' : 'Verify Your Email'}
                </h3>
                
                <p className={`text-sm mt-1 ${isVerificationSent ? 'text-green-600' : 'text-gray-500'}`}>
                  {isVerificationSent ? (
                    <>
                      We&apos;ve sent a verification link to <br />
                      <span className="font-medium">{formData.email}</span>
                    </>
                  ) : (
                    "You'll receive a verification email after signing up"
                  )}
                </p>
              </div>

              {isVerificationSent && (
                <div className="space-y-2 pt-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Check your inbox
                  </Badge>
                  <p className="text-xs text-green-600">
                    Didn&apos;t receive it? Check your spam folder or{' '}
                    <button className="underline font-medium hover:text-green-700">
                      resend email
                    </button>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card> */}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/auth/signin" className="font-medium text-primary hover:underline">
            Sign in here
          </a>
        </div>
      </div>
    </div>
  )
}