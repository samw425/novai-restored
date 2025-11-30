from PIL import Image, ImageDraw
import math

# Config
WIDTH = 1200
HEIGHT = 630
BG_COLOR = '#0F172A'  # Slate 900
ACCENT_COLOR = '#22D3EE' # Cyan 400
PRIMARY_COLOR = '#2563EB' # Blue 600

def draw_hexagon(draw, center_x, center_y, radius, color, width=0, fill=None):
    angle_step = 60
    points = []
    for i in range(6):
        angle_deg = 60 * i - 30
        angle_rad = math.radians(angle_deg)
        x = center_x + radius * math.cos(angle_rad)
        y = center_y + radius * math.sin(angle_rad)
        points.append((x, y))
    
    if fill:
        draw.polygon(points, fill=fill)
    else:
        draw.polygon(points, outline=color, width=width)

# Create Image
img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
draw = ImageDraw.Draw(img)

# Draw Outer Hexagon
draw_hexagon(draw, WIDTH//2, HEIGHT//2, 150, ACCENT_COLOR, width=12)

# Draw Inner Hexagon (Filled)
draw_hexagon(draw, WIDTH//2, HEIGHT//2, 80, ACCENT_COLOR, fill=ACCENT_COLOR)

# Draw decorative lines
line_y = HEIGHT // 2
draw.line([(0, line_y), (WIDTH//2 - 180, line_y)], fill=PRIMARY_COLOR, width=4)
draw.line([(WIDTH//2 + 180, line_y), (WIDTH, line_y)], fill=PRIMARY_COLOR, width=4)

# Save
img.save('public/social-preview.png')
print("Generated public/social-preview.png")
