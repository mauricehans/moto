import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getAccessToken } from '../services/adminService'

type Props = { children: ReactNode }

export default function RequireAdmin({ children }: Props) {
  const token = getAccessToken()
  const location = useLocation()
  if (!token) {
    return <Navigate to="/admin/password-reset" state={{ from: location }} replace />
  }
  return <>{children}</>
}
