'use client'
import {setRole,removeRole,checkRole} from '@/utils/roles'
import { useUser,useAuth } from '@clerk/nextjs'
export default  function HospitalDashboard() {
    // return <p>This is the protected hospital dashboard restricted to users with the `admin` role.</p>
    const {userId} = useAuth()
    const handleSetRole = async () => {
      const response = await checkRole('patient')
      console.log(response)
    }
    return (
    <>
    <button onClick={handleSetRole}>Set Role</button>
    </>)
  }