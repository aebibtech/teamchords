import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { getProfile } from '../utils/common'
import { useProfileStore } from '../store/useProfileStore'

const AuthCallback = () => {
  const navigate = useNavigate()
  const { session } = useAuthStore()
  const { setUserProfile } = useProfileStore()

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        const d = await getProfile(session.user.id)
        if (d) {
          setUserProfile(d)
          navigate('/library')
        } else {
          navigate('/onboard')
        }
      }
    }
    fetchProfile()
  }, [session, setUserProfile, navigate])

  return <div>Signing you in...</div>
}

export default AuthCallback
