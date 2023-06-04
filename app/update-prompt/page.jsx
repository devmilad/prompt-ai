"use client"

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import {useEffect, useState} from 'react'

import Form from '@components/Form'


const EditPost = () => {
  const router = useRouter();
  const searchPrams = useSearchParams()
  const promptId = searchPrams.get('id')
  const [submitting, setSubmitting] = useState(false)
   const [post, setPost] = useState({
    prompt: '',
    tag: ''
  })

  useEffect(() => {
        const getPromptDetail = async () =>{
            const response = await fetch(`/api/prompt/${promptId}`)
            const data = await response.json()

            setPost({
                prompt : data.prompt,
                tag: data.tag
            })
        }

        if(promptId) getPromptDetail()
  }, [promptId])
  

  const updatePrompt=async (e) =>{
    e.preventDefault()
    setSubmitting(true)

    if(!promptId) return alert('Prompt ID not found')

    try {
      const response= await fetch(`/api/prompt/${promptId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag
        })
      })
      if (response.ok) {
         router.push('/')
      }
    } catch (error) {
      console.log(error)
    }finally{
      setSubmitting(false)
    }
  }


  return (
    <Form
        type='Edit'
        post={post}
        setPost={setPost}
        submitting={submitting}
        handleSubmit={updatePrompt}
    />
  )
}

export default EditPost
