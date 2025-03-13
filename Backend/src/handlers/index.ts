import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import slug from "slug";
import formidable from "formidable";
import cloudinary from "../config/cloudinary";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";

import { generateJWT } from "../utils/jwt";
// creando el usuario y controlando errores, con validaciones
export const createAccount = async (req: Request, res: Response) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  const userExist = await User.findOne({ email });

  if (userExist) {
    const error = new Error("El usuario con ese email ya esta registrado");
    res.status(409).json({ error: error.message });
    return;
  }
  const handle = slug(req.body.handle, "");
  const handleExist = await User.findOne({ handle });
  if (handleExist) {
    const error = new Error("Nombre de handle ya existe");
    res.status(409).json({ error: error.message });
    return;
  }

  const user = new User(req.body);
  user.password = await hashPassword(password);
  user.handle = handle;
  await user.save();
  res.status(201).send("Registro Creado Correctamente");
};

export const login = async (req: Request, res: Response) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("El usuario no existe");
    res.status(404).json({ error: error.message });
    return;
  }
  //comprobar password
  const isPasswordCorrect = await checkPassword(password, user.password);

  if (!isPasswordCorrect) {
    const error = new Error("La contraseña no es correcta");
    res.status(404).json({ error: error.message });
    return;
  }

  const token = generateJWT({ id: user._id });

  res.send(token);
};

export const getUser = async (req: Request, res: Response) => {
  res.json(req.user);
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { description, links } = req.body;

    const handle = slug(req.body.handle, "");
    const handleExist = await User.findOne({ handle });
    if (handleExist && handleExist.email !== req.user.email) {
      const error = new Error("Nombre de handle ya existe");
      res.status(409).json({ error: error.message });
      return;
    }

    req.user.handle = handle;
    req.user.description = description;
    req.user.links = links;
    await req.user.save();
    res.send("Perfil Actualizado Correctamente");
  } catch (e) {
    const error = new Error("Error al actualizar el usuario");
    res.status(404).json({ error: error.message });
    return;
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  const form = formidable({ multiples: false });

  try {
    form.parse(req, (err, fields, files) => {
      cloudinary.uploader.upload(
        files.file[0].filepath,
        { public_id: uuidv4() },
        async function (error, result) {
          if (error) {
            const error = new Error("Error al subir la imagen");
            res.status(500).json({ error: error.message });
            return;
          }
          if (result) {
            req.user.image = result.secure_url;
            await req.user.save();
            res.json({ image: result.secure_url });
          }
        }
      );
    });
  } catch (e) {
    const error = new Error("Error al actualizar el usuario");
    res.status(404).json({ error: error.message });
    return;
  }
};
function uuid(): string {
  throw new Error("Function not implemented.");
}

export const getUserByHandle = async (req: Request, res: Response) => {
  try {
    const {handle} = req.params
    const user = await User.findOne({handle}).select('-_id -__v -email -password')
    if(!user){
      const error = new Error('El usuario no existe')
      res.status(404).json({error: error.message})
      return
    }
    res.json(user)
   
  } catch (e) {
    const error = new Error("Hubo un error");
    res.status(404).json({ error: error.message });
    return;
  }
}

export const searchByHandle = async (req: Request, res: Response) => {
  try {
    const {handle} = req.body
    const userExists = await User.findOne({handle})
    if(userExists){
      const  error = new Error(`${handle} ya esta registrado`);
      res.status(409).json({ error: error.message });
      return
    }
    res.send(`${handle} está disponible`)

  } catch (e) {
    const error = new Error("Hubo un error");
    res.status(404).json({ error: error.message });
    return;
  }
}