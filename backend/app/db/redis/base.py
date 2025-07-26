import redis

from app.core.config import settings


class RedisBase:
    def __init__(self):
        self.redis = redis.Redis(
            host=settings.HOST_REDIS,
            port=settings.PORT_REDIS,
            db=settings.NUMBER_DB_REDIS,
            decode_responses=True,  # Trả về string thay vì bytes
        )

    def set(self, key: str, value: str, ex: int = None):
        return self.redis.set(name=key, value=value, ex=ex)

    def get(self, key: str):
        return self.redis.get(name=key)

    def delete(self, key: str):
        return self.redis.delete(key)

    def hset(self, key: str, mapping: dict):
        return self.redis.hset(name=key, mapping=mapping)

    def hgetall(self, key: str):
        return self.redis.hgetall(name=key)

    def keys(self, pattern="*"):
        return self.redis.keys(pattern)

    def exists(self, key: str):
        return self.redis.exists(key)


rdBase = RedisBase()
