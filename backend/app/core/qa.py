import json
import os
import time
from datetime import datetime

import google.generativeai as genai
from langchain.chains import RetrievalQA
from langchain.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate

from app.core.config import settings
from app.core.message.infor_message import InforMessage
from app.training_doc.training_document_bitcoin import \
    generate_training_document
from app.worker.fetch_price import (fetch_24h_stats,
                                    fetch_and_save_bitcoin_price, fetch_klines,
                                    fetch_orderbook, fetch_price)


class QASystem:
    def __init__(self):
        self.model_id = "gemini-2.5-flash"
        self.index_path = "faiss_index"
        os.environ["GOOGLE_API_KEY"] = settings.KEY_GEMINI
        genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
        self.qa = None

    def initialize(self):
        if self.qa is not None:
            return
        # 2. Tải dữ liệu
        loader = TextLoader("./app/data/training_bitcoin_latest.txt", encoding="utf-8")
        docs = loader.load_and_split()

        # 3. Embedding (có thể thay bằng model tiếng Việt)
        embedding_model = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )

        # 4. Vectorstore FAISS
        vectorstore = FAISS.from_documents(docs, embedding_model)
        vectorstore.save_local("faiss_index")

        # 5. Load lại FAISS retriever
        retriever = FAISS.load_local(
            "faiss_index", embedding_model, allow_dangerous_deserialization=True
        ).as_retriever()

        # 6. Prompt template cho RAG
        template = """
        Sử dụng ngữ cảnh sau để trả lời câu hỏi bằng tiếng Việt.
        Nếu không tìm thấy thông tin, chỉ nói bạn không biết và yêu cầu người dùng hãy hỏi về tiền ảo.

        Ngữ cảnh:
        {context}

        Câu hỏi:
        {question}

        Trả lời:"""
        prompt = PromptTemplate(
            input_variables=["context", "question"], template=template
        )

        # 7. Tạo Gemini wrapper
        from langchain_google_genai import ChatGoogleGenerativeAI

        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.7)

        # 8. RAG QA Chain
        self.qa = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            chain_type_kwargs={"prompt": prompt},
        )

    def ask(self, query: str):
        answer = self.qa.run(query)
        return answer

    def get_infor_new(self):
        json_data_price = fetch_price()
        json_data_24h = fetch_24h_stats()
        json_data_orderbook = fetch_orderbook()
        json_data_klines = fetch_klines()
        json_data_infor_bitstream = InforMessage.INFOR_BITSTREAM
        data = {
            "timestamp": datetime.utcnow().isoformat(),
            "price": json_data_price,
            "stats_24h": json_data_24h,
            "orderbook": json_data_orderbook,
            "klines": json_data_klines,
            "infor_bitstream": json_data_infor_bitstream,
        }

        # ✅ Ghi đè file "latest" để RAG luôn đọc được bản mới nhất
        with open("../data/binance_btc_latest.json", "w") as f:
            json.dump(data, f, indent=2)

        # ✅ Ghi snapshot theo timestamp (optional: phục vụ huấn luyện hoặc theo dõi lịch sử)
        timestamp_str = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        with open(f"../data/binance_btc_{timestamp_str}.json", "w") as f:
            json.dump(data, f, indent=2)
        print("1")
        time.sleep(5)

    def reload_rag(self, path_training_txt: str):
        if self.qa is not None:
            # 2. Tải dữ liệu
            loader = TextLoader(path_training_txt, encoding="utf-8")
            docs = loader.load_and_split()

            # 3. Embedding (có thể thay bằng model tiếng Việt)
            embedding_model = HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            )

            # 4. Vectorstore FAISS
            vectorstore = FAISS.from_documents(docs, embedding_model)
            vectorstore.save_local("faiss_index")

            # 5. Load lại FAISS retriever
            retriever = FAISS.load_local(
                "faiss_index", embedding_model, allow_dangerous_deserialization=True
            ).as_retriever()

            # 6. Prompt template cho RAG
            template = """
                    Sử dụng ngữ cảnh sau để trả lời câu hỏi bằng tiếng Việt.
                    Nếu không tìm thấy thông tin, chỉ nói bạn không biết và yêu cầu người dùng hãy hỏi về tiền ảo.
    
                    Ngữ cảnh:
                    {context}
    
                    Câu hỏi:
                    {question}
    
                    Trả lời:"""
            prompt = PromptTemplate(
                input_variables=["context", "question"], template=template
            )

            # 7. Tạo Gemini wrapper
            from langchain_google_genai import ChatGoogleGenerativeAI

            llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.7)

            # 8. RAG QA Chain
            self.qa = RetrievalQA.from_chain_type(
                llm=llm,
                chain_type="stuff",
                retriever=retriever,
                chain_type_kwargs={"prompt": prompt},
            )


qa_system = QASystem()
