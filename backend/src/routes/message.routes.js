import { Router } from "express";
import { authenticate } from '../middleware/auth.js'
import {
    getExchangeMessages,
    sendExchangeMessage,
} from "../controllers/messageController.js"

const router = Router();

router.get("/:id/messages",authenticate,getExchangeMessages);
router.post("/:id/message",authenticate,sendExchangeMessage);

export default router