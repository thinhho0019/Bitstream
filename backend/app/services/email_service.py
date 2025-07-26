import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv

load_dotenv()


class EmailService:
    def __init__(self, email_address: str, email_password: str):
        self.email_address = email_address
        self.email_password = email_password

    def send(self, to_email: str, subject: str, content: str, html=False):
        try:
            msg = EmailMessage()
            msg["Subject"] = subject
            msg["From"] = self.email_address
            msg["To"] = to_email
            if html:
                msg.add_alternative(content, subtype="html")
            else:
                msg.set_content(content)
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
                smtp.login(self.email_address, self.email_password)
                smtp.send_message(msg)
            return True
        except Exception as ex:
            print(ex)
            return False


email_service = EmailService(
    email_address=os.getenv("EMAIL_ADDRESS"), email_password=os.getenv("EMAIL_PASSWORD")
)
