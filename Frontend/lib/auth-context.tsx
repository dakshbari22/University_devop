"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { User, UserRole, Course, TimetableEntry, Notice } from "./store"
import { DEMO_COURSES, DEMO_TIMETABLE, DEMO_NOTICES, DEMO_USERS } from "./store"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => boolean
  signup: (name: string, email: string, password: string, role: UserRole, department: string) => boolean
  logout: () => void
  courses: Course[]
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>
  timetable: TimetableEntry[]
  setTimetable: React.Dispatch<React.SetStateAction<TimetableEntry[]>>
  notices: Notice[]
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>
  enrollInCourse: (courseId: string, password: string) => { success: boolean; message: string }
  unenrollFromCourse: (courseId: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [courses, setCourses] = useState<Course[]>(DEMO_COURSES)
  const [timetable, setTimetable] = useState<TimetableEntry[]>(DEMO_TIMETABLE)
  const [notices, setNotices] = useState<Notice[]>(DEMO_NOTICES)
  const [registeredUsers, setRegisteredUsers] = useState(DEMO_USERS)

  const login = useCallback((email: string, _password: string, role: UserRole): boolean => {
    const userList = role === "student" ? registeredUsers.students : registeredUsers.teachers
    const found = userList.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (found) {
      setUser(found)
      return true
    }
    return false
  }, [registeredUsers])

  const signup = useCallback((name: string, email: string, _password: string, role: UserRole, department: string): boolean => {
    const allUsers = [...registeredUsers.students, ...registeredUsers.teachers]
    if (allUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return false
    }
    const newUser: User = {
      id: `${role[0]}${Date.now()}`,
      name,
      email,
      role,
      department,
    }
    if (role === "student") {
      setRegisteredUsers((prev) => ({ ...prev, students: [...prev.students, newUser] }))
    } else {
      setRegisteredUsers((prev) => ({ ...prev, teachers: [...prev.teachers, newUser] }))
    }
    setUser(newUser)
    return true
  }, [registeredUsers])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const enrollInCourse = useCallback((courseId: string, password: string) => {
    if (!user || user.role !== "student") return { success: false, message: "Not authorized" }
    const course = courses.find((c) => c.id === courseId)
    if (!course) return { success: false, message: "Course not found" }
    if (course.enrolledStudents.includes(user.id)) return { success: false, message: "Already enrolled" }
    if (course.enrollmentPassword !== password) return { success: false, message: "Incorrect enrollment password" }

    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, enrolledStudents: [...c.enrolledStudents, user.id] } : c))
    )
    return { success: true, message: "Successfully enrolled" }
  }, [user, courses])

  const unenrollFromCourse = useCallback((courseId: string) => {
    if (!user) return
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, enrolledStudents: c.enrolledStudents.filter((id) => id !== user.id) } : c
      )
    )
  }, [user])

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, courses, setCourses, timetable, setTimetable, notices, setNotices, enrollInCourse, unenrollFromCourse }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
