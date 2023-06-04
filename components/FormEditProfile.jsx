"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const FormEditProfile = ({username, imageUrl}) => {

    const [newUsername, setNewUsername] = useState(username)
    const [photo, setPhoto] = useState(imageUrl)
    const {data:session, update} = useSession()
    const router = useRouter();

    const CLOUD_NAME='dvyickd2i'
    const UPLOAD_PRESET = 'prompt'
    const handleSubmit =async (e) =>{
        e.preventDefault()

        try {
            const newImageUrl = await uploadImage()
            const res = await fetch(`/api/users/${session?.user.id}`,{
                headers:{
                    "Content-type" : 'application/json'
                },
                method : 'PATCH',
                body: JSON.stringify({
                    username:newUsername,
                    image: newImageUrl
                  })
            })
            if (res.ok) {
                router.push('/')
             }
        } catch (error) {
            console.log(error)
        }
    }

    const uploadImage = async ()=>{
        if(!photo) {
            setPhoto(imageUrl)
            return photo
        }

        const formData = new FormData()
        formData.append('file', photo)
        formData.append('upload_preset', UPLOAD_PRESET)
        
        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,{
                method: 'POST',
                body: formData
            })

            const data = await res.json()
            const newImageUrl = data['secure_url']
            return newImageUrl
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="flex flex-col items-center justify-center   mx-auto mt-14 lg:py-0">

            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Edite your account
                    </h1>
                    <form className=" md:space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">UserName</label>
                            <input 
                                    type="text" 
                                    name="username" 
                                    id="username" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                     placeholder='Your username' 
                                     value={newUsername}
                                     required
                                     onChange={(e)=>setNewUsername(e.target.value)}
                                />
                        </div>
                        <div className="my-5">

                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Avator</label>
                            <input 
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                                id="file_input"
                                type="file"
                                onChange={(e)=>setPhoto(e.target.files[0])}
                             />

                        </div>

                        <button type="submit" className="w-full text-white bg-slate-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 my-3">Update account</button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default FormEditProfile
