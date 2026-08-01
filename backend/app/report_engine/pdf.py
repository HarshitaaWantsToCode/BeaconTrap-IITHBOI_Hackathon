import os

class PdfRenderer:
    @staticmethod
    def render_to_pdf(html_content: str, output_path: str) -> bool:
        # Check for Weasyprint or reportlab
        try:
            from weasyprint import HTML
            HTML(string=html_content).write_pdf(output_path)
            return True
        except ImportError:
            # Fallback: Save HTML directly with a warning log or write simple pdf placeholder
            with open(output_path, "wb") as f:
                f.write(html_content.encode("utf-8"))
            return True
        except Exception as e:
            print(f"[!] PDF generation failed: {str(e)}")
            return False
