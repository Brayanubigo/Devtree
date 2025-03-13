import type {Request, Response, NextFunction} from 'express'
import { validationResult } from 'express-validator'

export const handleInputsErros = (req:Request,res:Response, next: NextFunction) => {

     let errors = validationResult(req)
        console.log(errors)
        if(!errors.isEmpty()){
            res.status(400).json({errors:errors.array()})
            return
        }
       
        next()

}