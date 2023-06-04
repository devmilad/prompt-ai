"use client"

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'

const PromptCard = ({ post, handleTagClick, handleEdit, handleDelete }) => {
  const [copied, setCopied] = useState('')
  const [liked, setLiked] = useState([])
  const [numLike, setNumLike] = useState(0)
  const { data: session, status } = useSession()
  const pathName = usePathname()
  const router = useRouter()

  const handleCopy = () => {
    setCopied(post.prompt)
    navigator.clipboard.writeText(post.prompt)
    setTimeout(() => setCopied(''), 3000)
  }

  const handleRoute = () => {
    if (session?.user.id !== post.creator._id) {
      router.push(`/profile/users?id=${post.creator._id}&&name=${post.creator.username}`)
    } else {
      router.push('/profile')
    }

  }

  const handleLike = async (e, postId) => {
    e.preventDefault()
    if (status === 'unauthenticated') {
      alert("You must sing in")
      return
    }
    if (session?.user.id === post.creator._id) {
      alert("You can not like your prompt")
      return
    }
    try {
      const response = await fetch(`/api/like/${postId}`, {
        method: 'POST',
        body: JSON.stringify({
          userId: session?.user.id,
          likedPost: postId,
        })
      })
      if (response.ok) {
        const data = response.json()
        setLiked(data)
      }

    } catch (error) {
      console.log(error)
    }
  }


const handleDeleteLike=async (e,likeId , userId) =>{
  e.preventDefault()
    if (status === 'unauthenticated') {
      alert("You must sing in")
      return
    }
    if (session?.user.id !== userId) {
      alert("You can not delete  ")
      return
    }

    try {
      await fetch(`/api/like/${likeId}`,{
        method: 'DELETE'
      })
    } catch (error) {
      console.log(error)
    }

    const filteredPosts = liked.filter(p=> p._id !== likeId)

    setLiked(filteredPosts)

}


  useEffect(() => {
    setNumLike(liked.length)
    const fetchLiked = async () => {
      const response = await fetch(`/api/like/${post?._id}`)
      const data = await response.json()
      setLiked(data)
    }
    fetchLiked()
    setNumLike(liked.length)
  }, [liked.length])



  return (
    <div className='prompt_card'>
      <div className="flex flex-between items-start gap-5">
        <div
          className='flex-1 flex-start items-center gap-3 cursor-pointer'
          onClick={handleRoute}
        >
          <Image
            src={post.creator.image}
            alt='user_image'
            width={40}
            height={40}
            className='rounded-full object-contain'
          />

          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-gray-900">
              {post.creator.username}
            </h3>
            <p className="font-inter text-sm text-gray-500">
              {post.creator.email}
            </p>
          </div>
        </div>

        <div className="copy_btn" onClick={handleCopy}>
          <Image
            src={copied === post.prompt
              ? '../assets/icons/tick.svg'
              : '../assets/icons/copy.svg'
            }
            width={14}
            height={14}
            alt='copy'
          />
        </div>
      </div>

      <p className='my-4 font-satoshi text-sm text-gray-700'>
        {post.prompt}
      </p>

      <div className="flex justify-between items-center">
        <p className='font-inter text-sm blue_gradient cursor-pointer'
          onClick={() => handleTagClick && handleTagClick(post.tag)}
        >
          #{post.tag}
        </p>
        <div className='flex justify-between items-center gap-2'>
          {session?.user.id === liked[0]?.userId._id ?
            liked.map(like => {
              if (session?.user.id === like.userId._id) {
                return <AiFillHeart className='text-red-500 cursor-pointer'  
                                                      onClick={(e) => handleDeleteLike(e,like._id,like.userId._id)}
                                                      key={like._id}
                              />
              }
            }) :
            <AiOutlineHeart
              className='text-red-700 cursor-pointer'
              onClick={(e) => handleLike(e, post._id)}
            />
          }


          <p className='font-inter text-sm blue_gradient'>{numLike}</p>
        </div>
      </div>

      {session?.user.id === post.creator._id && pathName === '/profile' && (
        <div className='mt-5 flex-center gap-5 border-t border-gray-100 pt-3 '>
          <p
            className="font-inter text-sm green_gradient cursor-pointer"
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className="font-inter text-sm orange_gradient cursor-pointer"
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  )
}

export default PromptCard
