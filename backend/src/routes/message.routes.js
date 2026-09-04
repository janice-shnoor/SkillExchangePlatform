import { Router } from "express";
import { authenticate } from '../middleware/auth.js'
import {
    getExchangeMessages,
    sendExchangeMessage,
} from "../controllers/messageController.js"

import { validate } from '../middleware/validate.js'
import { 
    sendMessageSchema,
    resourceIdSchema,
} from '../validators/validator.js'

const router = Router();

router.get("/:id/messages",authenticate, validate(resourceIdSchema),getExchangeMessages);
router.post("/:id/message",authenticate, validate(sendMessageSchema), sendExchangeMessage);

export default router