import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'

interface AuthGuardProps {
  hasToken: boolean;
  children: ReactNode;
  redirect: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ hasToken, children, redirect }) => {
  if (!hasToken) {
    return <Navigate to={redirect} replace />
  }

  return <>{children}</>
} 