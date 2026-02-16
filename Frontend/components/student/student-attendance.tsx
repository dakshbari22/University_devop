"use client"

import { Calendar, CheckCircle2, XCircle, Clock, TrendingUp, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// Helper to get status styling
const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case "present":
      return {
        icon: CheckCircle2,
        label: "Present",
        class: "bg-primary/10 text-primary border-primary/20",
      }
    case "absent":
      return {
        icon: XCircle,
        label: "Absent",
        class: "bg-destructive/10 text-destructive border-destructive/20",
      }
    case "late":
      return {
        icon: Clock,
        label: "Late",
        class: "bg-accent/10 text-accent-foreground border-accent/30",
      }
    default:
      return {
        icon: Calendar,
        label: status,
        class: "bg-muted text-muted-foreground",
      }
  }
}

export function StudentAttendance() {
  const { user, courses, attendance = [] } = useAuth()

  if (!user) return null

  const myAttendance = attendance.filter((record) => record.studentId === user.id)
  const totalClasses = myAttendance.length
  const presentCount = myAttendance.filter((r) => r.status.toLowerCase() === "present").length
  const absentCount = myAttendance.filter((r) => r.status.toLowerCase() === "absent").length
  const lateCount = myAttendance.filter((r) => r.status.toLowerCase() === "late").length
  const attendanceRate = totalClasses > 0 ? Math.round(((presentCount + lateCount) / totalClasses) * 100) : 0
  const sortedHistory = [...myAttendance].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const getCourseName = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    return course ? `${course.code} - ${course.name}` : "Unknown Course"
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground">Attendance</h2>
        <p className="text-sm text-muted-foreground">Track your class attendance and academic participation</p>
      </div>

      {/* STATS GRID - MODIFIED IN MAIN */}
      <div className="mb-8 border-2 border-dashed border-border rounded-xl p-8 text-center text-muted-foreground">
        <p>Statistics are currently being calculated. Please check back later.</p>
      </div>

      {/* Detailed History */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-6">
          <h3 className="font-semibold text-foreground">Attendance History</h3>
        </div>
        
        {sortedHistory.length === 0 ? (
          <div className="p-16 text-center">
            <User className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
            <h3 className="mb-1 text-lg font-medium text-foreground">No attendance records</h3>
            <p className="text-sm text-muted-foreground">Your attendance history will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sortedHistory.map((record) => {
              const config = getStatusConfig(record.status)
              const StatusIcon = config.icon
              const dateObj = new Date(record.date)
              const formattedDate = dateObj.toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })

              return (
                <div key={record.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 transition-colors hover:bg-muted/30">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{getCourseName(record.courseId)}</p>
                      <p className="text-sm text-muted-foreground">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center gap-2">
                    <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${config.class}`}>
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}