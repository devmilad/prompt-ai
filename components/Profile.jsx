'use client'
import PromptCard from './PromptCard'
import FormEditProfile from './FormEditProfile'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'


const Profile = ({ name, desc, data, handleEdit, handleDelete }) => {
  const pathName = usePathname()
  const {data:session , status} = useSession()
 const route = useRouter()
if (status === 'unauthenticated' && pathName === '/profile') {
  route.push('/')
}

  return (
    <section className='w-full'>
      <div className='flex  sm:flex-row flex-col flex-center'>
        <div>
          <h1 className="head_text text-left">
            <span className="blue_gradient">{name} Profile</span>
          </h1>
          <p className="desc text-left">{desc}</p>
        </div>
        { pathName === '/profile' &&  <FormEditProfile username={session?.user.name} imageUrl = {session?.user.image}/>}
       
      </div>
      
      <div className=' prompt_layout mt-10'>
        {data.map(post => (
          <PromptCard
            key={post._id}
            post={post}
            handleEdit={() => handleEdit && handleEdit(post)}
            handleDelete={() => handleDelete && handleDelete(post)}
          />
        ))}
      </div>



    </section>
  )
}

export default Profile
