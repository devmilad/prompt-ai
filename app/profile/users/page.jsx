"use client"

import Profile from '@components/Profile'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const usersProfile = () => {
  const [posts, setPosts] = useState([])
  const searchUserId = useSearchParams()
  const userId = searchUserId.get('id')
  const userName = searchUserId.get('name')


  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${userId}/posts`)
      const data = await response.json()
      setPosts(data)
    }
  
   if(userId) fetchPosts() 
  },[userId])
  return (
    <Profile 
        name={userName}
        desc= {`Welcome to ${userName} personalized profile page`}
        data={posts}
/>
  )
}

export default usersProfile
