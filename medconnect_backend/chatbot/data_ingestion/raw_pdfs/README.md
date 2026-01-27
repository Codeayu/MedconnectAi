# Place your medical PDF documents here for ingestion into Pinecone.
# 
# To ingest PDFs, run the following command from the medconnect_backend directory:
#
# python -c "from chatbot.data_ingestion.embed_and_upload import ingest_pdfs; ingest_pdfs()"
#
# Or use Django shell:
# python manage.py shell
# >>> from chatbot.data_ingestion.embed_and_upload import ingest_pdfs
# >>> ingest_pdfs()
