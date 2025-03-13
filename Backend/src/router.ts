import { Router } from "express";
import { body } from "express-validator";
import { createAccount, getUser, getUserByHandle, login, searchByHandle, updateUser, uploadImage } from "./handlers";
import { handleInputsErros } from "./middleware/validation";
import { authenticate } from "./middleware/auth";


const router = Router();

//routing
router.post(
  "/auth/register",
  body("handle").notEmpty().withMessage("El handle no puede ir vacio"),
  body("name").notEmpty().withMessage("El nombre no puede ir vacio"),
  body("email").isEmail().withMessage("E-mail no valido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto mínimo 8 caracteres"),
  handleInputsErros,
  createAccount
);

router.post(
  "/auth/login",
  body("email").isEmail().withMessage("E-mail no valido"),
  body("password").notEmpty().withMessage("El password es obligatorio"),
  handleInputsErros,
  login
);

router.get("/user", authenticate, getUser);

router.patch(
  "/user",
  body("handle").notEmpty().withMessage("El handle no puede ir vacio"),
  
  authenticate,
  updateUser
);

router.get('/:handle', getUserByHandle)

router.post('/search',body("handle")
.notEmpty()
.withMessage("El handle no puede ir vacio"), 
handleInputsErros, searchByHandle)

router.post('/user/image' , authenticate, uploadImage)
export default router;
