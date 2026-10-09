import zlib
import struct
import math

def create_png(width, height, draw_func):
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0) # Filter type 0 (None)
        for x in range(width):
            r, g, b, a = draw_func(x, y, width, height)
            raw_data.extend([r, g, b, a])
    
    # PNG signature
    png = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png += struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data
    png += struct.pack('>I', zlib.crc32(b'IHDR' + ihdr_data) & 0xffffffff)
    
    # IDAT chunk
    compressed = zlib.compress(bytes(raw_data), 9)
    png += struct.pack('>I', len(compressed)) + b'IDAT' + compressed
    png += struct.pack('>I', zlib.crc32(b'IDAT' + compressed) & 0xffffffff)
    
    # IEND chunk
    png += struct.pack('>I', 0) + b'IEND'
    png += struct.pack('>I', zlib.crc32(b'IEND') & 0xffffffff)
    
    return png

def d20_icon_pixel(x, y, w, h):
    # Normalized coords (-1 to 1)
    nx = (x / (w - 1)) * 2 - 1
    ny = (y / (h - 1)) * 2 - 1
    dist = math.sqrt(nx * nx + ny * ny)
    
    # Rounded rect background (radius ~ 0.85)
    r_sq = (abs(nx)**4 + abs(ny)**4)**0.25
    if r_sq > 0.95:
        return 0, 0, 0, 0 # Transparent corners
    
    # Background gradient: deep dark navy / violet
    bg_r = int(15 + (1.0 - ny) * 12)
    bg_g = int(20 + (1.0 - ny) * 10)
    bg_b = int(45 + (1.0 - ny) * 35)
    
    # Golden border around rounded box
    if r_sq > 0.90:
        return 245, 158, 11, 255
    
    # Hexagon / D20 outer shape
    # Hexagon equation: max(|y|, |x|*0.5 + |y|*0.866)
    hex_val = max(abs(ny) * 0.866 + abs(nx) * 0.5, abs(nx))
    
    if hex_val < 0.65:
        # Inside D20 face
        # Center triangle
        if ny > -0.35 and (abs(nx) < (0.6 - (ny + 0.35) * 0.8)):
            # Golden center triangle
            return 245, 158, 11, 255
        elif hex_val > 0.60:
            # Outer facet border
            return 251, 191, 36, 255
        else:
            # Facet interior
            return 49, 46, 129, 255
    elif hex_val < 0.70:
        # Golden hexagon outline
        return 245, 158, 11, 255
    
    return bg_r, bg_g, bg_b, 255

with open('public/icon-192.png', 'wb') as f:
    f.write(create_png(192, 192, d20_icon_pixel))

with open('public/icon-512.png', 'wb') as f:
    f.write(create_png(512, 512, d20_icon_pixel))

with open('public/apple-touch-icon.png', 'wb') as f:
    f.write(create_png(180, 180, d20_icon_pixel))

print("PNG icons created successfully!")
