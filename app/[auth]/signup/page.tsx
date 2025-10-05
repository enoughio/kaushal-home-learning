"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, User, UserCheck, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: ''
  })
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: ''
  })
  const [touched, setTouched] = useState({
    email: false,
    firstName: false,
    lastName: false,
    role: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate form before submission
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong, Try again later')
      }

      // Success - show verification sent message
      setIsVerificationSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    return ''
  }

  const validateFirstName = (firstName: string): string => {
    if (!firstName.trim()) return 'First name is required'
    if (firstName.trim().length < 2) return 'First name must be at least 2 characters'
    if (!/^[a-zA-Z\s]+$/.test(firstName.trim())) return 'First name can only contain letters'
    return ''
  }

  const validateLastName = (lastName: string): string => {
    if (!lastName.trim()) return 'Last name is required'
    if (lastName.trim().length < 2) return 'Last name must be at least 2 characters'
    if (!/^[a-zA-Z\s]+$/.test(lastName.trim())) return 'Last name can only contain letters'
    return ''
  }

  const validateRole = (role: string): string => {
    if (!role) return 'Please select a role'
    return ''
  }

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'email':
        return validateEmail(value)
      case 'firstName':
        return validateFirstName(value)
      case 'lastName':
        return validateLastName(value)
      case 'role':
        return validateRole(value)
      default:
        return ''
    }
  }

  const validateForm = (): boolean => {
    const errors = {
      email: validateEmail(formData.email),
      firstName: validateFirstName(formData.firstName),
      lastName: validateLastName(formData.lastName),
      role: validateRole(formData.role)
    }

    setFieldErrors(errors)
    setTouched({
      email: true,
      firstName: true,
      lastName: true,
      role: true
    })

    return !Object.values(errors).some(error => error !== '')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field error when user starts typing
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field as keyof typeof formData])
    setFieldErrors(prev => ({ ...prev, [field]: error }))
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
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
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
                    className={`pl-10 ${fieldErrors.email && touched.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    required
                  />
                </div>
                {fieldErrors.email && touched.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.email}
                  </p>
                )}
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
                  className={fieldErrors.firstName && touched.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                  required
                />
                {fieldErrors.firstName && touched.firstName && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.firstName}
                  </p>
                )}
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
                  className={fieldErrors.lastName && touched.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                  required
                />
                {fieldErrors.lastName && touched.lastName && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  Role
                </Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => {
                    handleInputChange('role', value)
                    handleBlur('role')
                  }}
                >
                  <SelectTrigger className={fieldErrors.role && touched.role ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}>
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
                {fieldErrors.role && touched.role && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.role}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={
                  !formData.email || 
                  !formData.firstName || 
                  !formData.lastName || 
                  !formData.role || 
                  isLoading ||
                  Object.values(fieldErrors).some(error => error !== '')
                }
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Email Verification Section */}
        {isVerificationSent && (
          <Card className="shadow-lg border-0 transition-all duration-300 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-green-800">
                    Verification Email Sent!
                  </h3>
                  
                  <p className="text-sm mt-1 text-green-600">
                    We&apos;ve sent a verification link to <br />
                    <span className="font-medium">{formData.email}</span>
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                    Check your inbox
                  </div>
                  <p className="text-xs text-green-600">
                    Didn&apos;t receive it? Check your spam folder
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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