# from twilio.rest import Client
from fastapi import APIRouter, Request
from fastapi.responses import PlainTextResponse
import httpx
import os

router = APIRouter()


@router.post("/webhook")
async def receive_whatsapp_message(request: Request):
    form = await request.form()

    phone = form.get("From").replace("whatsapp:", "")
    text = form.get("Body")

    # I'm calling the /message endpoint internally to reuse the logic I already have there for handling incoming messages, creating users, saving messages to DB, etc. This way I don't have to duplicate that logic here in the webhook handler. Once I have the logic for generating answers from Seek implemented in the /message endpoint, I can just call that and it will handle everything, including saving messages to the DB and returning the answer to send back to the user.
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{os.getenv('APP_URL')}/message",
            json={"phone": phone, "message": text}
        )
        result = response.json()

    # Send answer back to user
    send_whatsapp_message(phone, result["answer"])

    # If new user, send chat link
    if "chat_link" in result:
        send_whatsapp_message(phone, f"View your chat history: {result['chat_link']}")

    return PlainTextResponse("ok")


def send_whatsapp_message(to: str, text: str):
    client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))
    client.messages.create(
        from_=f"whatsapp:{os.getenv('TWILIO_PHONE_NUMBER')}",
        to=f"whatsapp:{to}",
        body=text
    )
