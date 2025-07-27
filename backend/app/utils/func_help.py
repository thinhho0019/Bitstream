import json
import os
import traceback
from pathlib import Path

"""
fix key and dont change key old
"""


def read_and_fix_json(file_path: Path, new_data):
    try:
        if os.path.exists(str(file_path)):
            with open(file_path, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        else:
            existing_data = {}

        # ✅ Bước 2: Cập nhật key (chỉ ghi đè những key trùng)
        existing_data.update(new_data)

        # ✅ Bước 3: Ghi lại file
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(existing_data, f, indent=2)
    except Exception as ex:
        print(ex)
        traceback.print_exc()
