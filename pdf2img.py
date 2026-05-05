import fitz

doc = fitz.open("258.pdf")
page = doc.load_page(0)
pix = page.get_pixmap(dpi=300)
pix.save("258.png")
