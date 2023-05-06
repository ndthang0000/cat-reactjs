import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import axiosInstance from '../axios'

const RequireAuth = ({ children }) => {
  const isAuthenticate = useSelector(state => state.isAuthenticate)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const checkToken = async () => {
    const getLocalToken = localStorage.getItem('token')
    if (!getLocalToken) {
      dispatch({ type: 'logout' })
      navigate('/login', { replace: true })
    }
    try {
      const data = await axiosInstance.get(`/auth/check-token`)
      dispatch({ type: 'login', userInformation: data.data.user })
    }
    catch (err) {
      localStorage.removeItem('token')
      return navigate('/login')
    }
  }


  useEffect(() => {
    if (!isAuthenticate) {
      checkToken()
    }
  }, [isAuthenticate])
  return (
    <div>{children}</div>
  )
}

export default RequireAuth