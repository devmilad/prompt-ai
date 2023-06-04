import LikePost from "@models/like"
import { connectToDB } from "@utils/database"

export const POST = async (req) =>{
    const {userId, likedPost} = await req.json()

    try {
        await connectToDB()
        const newLikePrompt = new LikePost({
            userId,
            likedPost,
        })

        await newLikePrompt.save()

        return new Response(JSON.stringify(newLikePrompt), { status: 201 })
    } catch (error) {
        return new Response('Failed to create a new prompt', {status: 500})
    }
}


export const GET= async (request,{params}) =>{
    try {
        await connectToDB()

        const like = await LikePost.find({likedPost: params.id}).populate('userId')

        if(!like) return new Response('Prompt not found', {status : 404})

        return new Response(JSON.stringify(like), {status : 201})
    } catch (error) {
        return new Response('Failed to fetch prompt', {status : 500})
    }
}


export const DELETE = async (request, {params}) =>{
    try {
        await connectToDB()

        await LikePost.findByIdAndRemove(params.id)
        return new Response("Prompt deleted successfully", {status : 201})
        
    } catch (error) {
        return new Response('Failed to delete prompt', {status : 500})
    }
}