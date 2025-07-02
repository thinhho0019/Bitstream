import time

from fetch_price import fetch_and_save_bitcoin_price

while True:
    fetch_and_save_bitcoin_price()
    time.sleep(10)
