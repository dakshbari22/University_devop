"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { StudentOverview } from "./student-overview"
import { StudentCourses } from "./student-courses"
import { StudentTimetable } from "./student-timetable"
import { StudentNotices } from "./student-notices"

interface StudentDashboardProps {
  onLogout: () => void
}

export function StudentDashboard({ onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout} />
      <main className="mx-auto max-w-7xl px-6 py-8">
        {activeTab === "dashboard" && <StudentOverview onTabChange={setActiveTab} />}
        {activeTab === "courses" && <StudentCourses />}
        {activeTab === "timetable" && <StudentTimetable />}
        {activeTab === "notices" && <StudentNotices />}
      </main>
    </div>
  )
}
