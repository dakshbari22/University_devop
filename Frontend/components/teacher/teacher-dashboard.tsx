"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { TeacherCourses } from "./teacher-courses"
import { TeacherTimetable } from "./teacher-timetable"
import { TeacherNotices } from "./teacher-notices"

interface TeacherDashboardProps {
  onLogout: () => void
}

export function TeacherDashboard({ onLogout }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState("courses")

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout} />
      <main className="mx-auto max-w-7xl px-6 py-8">
        {activeTab === "courses" && <TeacherCourses />}
        {activeTab === "timetable" && <TeacherTimetable />}
        {activeTab === "notices" && <TeacherNotices />}
      </main>
    </div>
  )
}
