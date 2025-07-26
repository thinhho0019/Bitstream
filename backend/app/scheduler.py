import logging
from datetime import datetime

import redis
from apscheduler.jobstores.redis import RedisJobStore
from apscheduler.schedulers.background import BackgroundScheduler

from app.core.config import settings
from app.jobs.btc_alert import notify_btc
from app.jobs.update_price import update_price_btc

logger = logging.getLogger(__name__)
scheduler = BackgroundScheduler()


def start_scheduler():
    jobstores = {
        "default": RedisJobStore(
            host=settings.HOST_REDIS,
            port=settings.PORT_REDIS,
            db=settings.NUMBER_DB_REDIS,
        )
    }
    scheduler.configure(jobstores)

    # scheduler.add_job(
    #     notify_btc,
    #     trigger='interval',
    #     seconds=60,
    #     id="monitor_btc_price",
    #     max_instances=5
    # )

    scheduler.add_job(
        update_price_btc,
        trigger="interval",
        seconds=15,  # update price btc on chatbox
        id="update_chat_box_data",
        max_instances=1,
    )
    scheduler.start()
    logger.info("🔄 APScheduler started.")
