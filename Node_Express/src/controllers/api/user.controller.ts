import type { Request, Response } from 'express';

import { User } from '../../models/User.js'; 
import { AppDataSource } from '../../data-source.js';

const userRepository = AppDataSource.getRepository(User)

async function getAllUsers(req:Request, res:Response) {
    const allMembers = await userRepository.find();
    res.json(allMembers);
}

async function getUser(req:Request, res:Response)
{
    const paramID = Number(req.params.id)
    const user = await userRepository.findOne({where: {id: paramID}})

    if (!user) {
        res.status(404).json({message: "Member not found"})
        return
    }

    res.json(user)
}

export {getAllUsers, getUser}