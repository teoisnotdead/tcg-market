import { Navigate } from 'react-router-dom'

export const AuthGuard = ({ hasToken, children, redirect }) => {
  if (!hasToken) {
    return <Navigate to={redirect} replace />
  }

  return children
}
