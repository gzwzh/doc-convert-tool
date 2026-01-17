from docx import Document

doc = Document()
doc.add_paragraph("Hello world")
doc.save("test_input.docx")
print("Created test_input.docx")
