import User from "@models/user"
import { connectToDB } from "@utils/database"

//  PATCH (update)
export const PATCH =async (request, {params}) =>{
    const {username, image} = await request.json()

    try {
        await connectToDB()
        const existingUser = await User.findById(params.id)
        if(!existingUser) new Response(' Prompt not found', {status : 404})
        
        existingUser.username = username
        existingUser.image= image

        await User.findByIdAndUpdate(params.id,existingUser)
        
        return new Response("Successfully updated the Prompts", {status : 201})
    } catch (error) {
        return new Response('Failed to update prompt', {status : 500})
    }
}