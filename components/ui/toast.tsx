"use client"

import * as React from "react"

// Minimal types to satisfy imports from project code (useToast expects these types).
// The real shadcn `toast` component is deprecated; we provide a small, type-only
// fallback so the codebase compiles and runtime behavior remains driven by the
// project's custom `useToast` implementation.

export type ToastActionElement = React.ReactNode

export interface ToastProps {
  id?: string
  open?: boolean
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  onOpenChange?: (open: boolean) => void
}

// No-op Toast component: shadcn previously provided UI. Projects can replace this
// with the official component or a custom UI later. For now it renders nothing
// (headless) and only provides types.
export function Toast(_: ToastProps) {
  return null
}

export default Toast
