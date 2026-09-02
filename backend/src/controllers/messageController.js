import {
    getMessages,
    sendMessage,
} from "../services/messageService.js"

export async function getExchangeMessages(req, res, next) {
    try {
        const messages = await getMessages(
            req.params.id,
            req.user.sub
        )

        res.status(200).json({
            success: true,
            messages,
        })
    } catch (e) {
        next(e)
    }
}

export async function sendExchangeMessage(req, res, next) {
    try {
        const message = await sendMessage(
            req.params.id,
            req.user.sub,
            req.body.content
        )

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: message,
        })
    } catch (e) {
        next(e)
    }
}