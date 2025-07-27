<p style="font-weight:bold">create table migrations</p>
- alembic init alembic
- alembic revision --autogenerate -m "init"



#update 
pip install -U langchain langchain-community langchain-huggingface

black .          # Format code
isort .          # Sort import
flake8 .         # Check lint
mypy .           # Check type (nếu dùng)
pytest           # Chạy test