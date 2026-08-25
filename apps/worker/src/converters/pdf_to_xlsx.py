import sys
import pdfplumber
import pandas as pd

def pdf_to_xlsx(pdf_path, xlsx_path):
    try:
        with pdfplumber.open(pdf_path) as pdf:
            with pd.ExcelWriter(xlsx_path, engine='openpyxl') as writer:
                table_count = 0
                for i, page in enumerate(pdf.pages):
                    # Extract tables from the page
                    tables = page.extract_tables()
                    for j, table in enumerate(tables):
                        # Convert to DataFrame
                        df = pd.DataFrame(table[1:], columns=table[0]) if len(table) > 1 else pd.DataFrame(table)
                        sheet_name = f"Page_{i+1}_Table_{j+1}"
                        # Excel sheet names must be <= 31 chars
                        df.to_excel(writer, sheet_name=sheet_name[:31], index=False)
                        table_count += 1
                
                # If no tables were found, just extract text to avoid empty file
                if table_count == 0:
                    text_data = []
                    for page in pdf.pages:
                        text = page.extract_text()
                        if text:
                            for line in text.split('\n'):
                                text_data.append([line])
                    if text_data:
                        df = pd.DataFrame(text_data, columns=["Extracted Text"])
                        df.to_excel(writer, sheet_name="Extracted_Text", index=False)
                    else:
                        # Empty PDF
                        pd.DataFrame(["No text or tables found"]).to_excel(writer, sheet_name="Empty", index=False)
        print("Success")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python pdf_to_xlsx.py <input.pdf> <output.xlsx>")
        sys.exit(1)
    
    pdf_to_xlsx(sys.argv[1], sys.argv[2])
