import { useEffect } from "react"
import { useResetState } from "./context"
import { useNavigate } from "react-router-dom"
import { Path as LoginPath } from "./login"

export const LogoutPath = "/logout"

export const Logout = () => {
  const resetAuthContext = useResetState()
  const navigate = useNavigate()

  useEffect(() => {
    resetAuthContext()
    navigate(LoginPath)
  }, [])

  return null
}
