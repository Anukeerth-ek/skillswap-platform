import {Request, Response} from 'express'
import prisma from '../prismaClient'
import { hashPassword } from '../utils/hash.utils'

export const signup = async(req:Request, res: Response)=> {
    const {name, email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({message: "Email and passsword is required"});
    }

    const existingUser = await prisma.user.findUnique({where: email})

    if(existingUser) {
        return res.status(409).json({message: 'User already exist'})
    }

    const hashdedUserPassword = await hashPassword(password)

    const newUser = await prisma.user.create({
        data: {name, email, password: hashdedUserPassword},
    })

    res.status(201).json({message: "user created", userId: newUser.id})
}
