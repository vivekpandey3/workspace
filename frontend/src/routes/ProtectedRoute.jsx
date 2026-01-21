import React, { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

export default function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext)

  if (!token) {
    // If user is not logged in, redirect to login
    return <Navigate to="/login" />
  }

  // If logged in, show children (Dashboard)
  return children
}
