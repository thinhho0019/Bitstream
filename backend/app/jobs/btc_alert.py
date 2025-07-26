from datetime import datetime

import redis

from app.api.asset_predictions import update_state_prediction
from app.core.config import settings
from app.db.database import SessionLocal
from app.db.redis.base import rdBase
from app.services.asset_prediction import update_asset_prediction_status
from app.services.email_service import email_service


def notify_btc():
    try:
        alert_keys = rdBase.keys("btc_alert:*")
        for key in alert_keys:
            id = key.replace("btc_alert:", "")
            alert_data = rdBase.hgetall(key)
            min_price = float(alert_data["min"])  # current_point
            max_price = float(alert_data["max"])  # next_price
            email = alert_data["email"]
            time_end = int(alert_data["time_end"])
            current_time = datetime.now().timestamp()
            print(min_price, max_price, email, time_end, current_time)
            db = SessionLocal()
            if current_time < time_end:
                # set state for db and redis
                # state running
                try:
                    update_asset_prediction_status(db, id, "running")
                except Exception:
                    # delete key if key doesnt exists
                    rdBase.delete(key)
            else:
                try:
                    update_asset_prediction_status(db, id, "ending")
                except Exception:
                    # delete key if key doesnt exists
                    rdBase.delete(key)
                finally:
                    return
            # current_price = float(rdBase.get("bitcoin_price"))
            current_price = 106193.0
            if min_price > max_price and current_price < max_price:
                # delete scheduler and update state
                update_asset_prediction_status(db, id, "notified")
                config_send_mail(current_price=current_price, email_des=email)
                rdBase.delete(key)
            elif min_price < max_price and current_price > min_price:
                update_asset_prediction_status(db, id, "notified")
                config_send_mail(current_price=current_price, email_des=email)
                rdBase.delete(key)
    except Exception as ex:
        print(ex)


def config_send_mail(current_price: float, email_des: str):
    # send mail for user email
    timestamp = datetime.now().strftime("%B %d, %Y %H:%M:%S")
    html_alert_bit = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Bitcoin Price Alert</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
            <div style="background-color: #ff9900; padding: 20px; color: white; text-align: center;">
              <h1>🚀 Bitcoin Hits a Beautiful Milestone!</h1>
            </div>
            <div style="padding: 20px;">
              <p>Hello,</p>
              <p>We're excited to inform you that <strong>Bitcoin (BTC)</strong> has just reached a beautiful milestone price:</p>

              <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 24px; margin: 20px 0;">
                💰 <strong>{current_price:,} USD</strong>
              </div>

              <p>Recorded at: <strong>{timestamp}</strong></p>

              <p style="margin-top: 30px;">Don't miss the opportunity! Consider reviewing your investment strategy today.</p>

              <a href="{settings.DASHBOARD_URL}" style="display: inline-block; margin-top: 20px; padding: 12px 20px; background-color: #ff9900; color: white; text-decoration: none; border-radius: 4px;">View Dashboard</a>
            </div>
            <div style="background-color: #eeeeee; padding: 10px; text-align: center; font-size: 12px; color: #777;">
              This email was sent automatically by the DataOps alert system. Please do not reply.
            </div>
          </div>
        </body>
        </html>
        """
    email_service.send(
        to_email=email_des,
        subject="🚀 NOTIFY BITCOIN ",
        content=html_alert_bit,
        html=True,
    )
