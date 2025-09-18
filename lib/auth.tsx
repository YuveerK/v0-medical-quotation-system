"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  createdAt: string
  lastLogin?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    email: "admin@kleinsmith.co.za",
    password: "admin123",
    name: "Dr. Ruwan Kleinsmith",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-06-10T09:30:00Z",
  },
  {
    id: "2",
    email: "staff@kleinsmith.co.za",
    password: "staff123",
    name: "Sarah Johnson",
    role: "user",
    createdAt: "2024-02-01T00:00:00Z",
    lastLogin: "2024-06-09T14:15:00Z",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("kleinsmith_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem("kleinsmith_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        createdAt: foundUser.createdAt,
        lastLogin: new Date().toISOString(),
      }

      setUser(userWithoutPassword)
      localStorage.setItem("kleinsmith_user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("kleinsmith_user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function requireAuth(allowedRoles?: ("admin" | "user")[]) {
  return (WrappedComponent: React.ComponentType<any>) =>
    function AuthenticatedComponent(props: any) {
      const { user, isLoading } = useAuth()

      if (isLoading) {
        return <div>Loading...</div>
      }

      if (!user) {
        return <div>Please log in to access this page.</div>
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <div>You don't have permission to access this page.</div>
      }

      return <WrappedComponent {...props} />
    }
}
