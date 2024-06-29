import smtplib
import sys
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(to_email, subject, body):
    from_email = "qqtechbab@gmail.com"
    from_password = "kgye tpgb pjqd xpxz"

    # Configuração do servidor SMTP
    smtp_server = "smtp.gmail.com"
    smtp_port = 587

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    try:
        print(f"Enviando email para {to_email}")
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(from_email, from_password)
        text = msg.as_string()
        server.sendmail(from_email, to_email, text)
        server.quit()
        print(f"Email enviado para {to_email}")
    except Exception as e:
        print(f"Erro ao enviar email: {e}")

if __name__ == "__main__":
    to_email = sys.argv[1]
    subject = sys.argv[2]
    body = sys.argv[3]
    send_email(to_email, subject, body)
