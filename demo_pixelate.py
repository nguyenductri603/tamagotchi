#!/usr/bin/env python3
"""
Demo script to test the pixelation feature of the Tamagotchi game.
This script shows how any image gets converted to 8-bit pixelated style.
"""

from PIL import Image
import sys
import os

def pixelate_image(image_path, output_path, pixel_size=8):
    """Convert image to pixelated 8-bit style"""
    try:
        print(f"Processing image: {image_path}")
        
        # Open and resize image
        img = Image.open(image_path)
        print(f"Original size: {img.size}")
        
        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')
            print(f"Converted to RGB mode")
        
        # Resize to small size for pixelation
        small_size = (64, 64)
        img_small = img.resize(small_size, Image.NEAREST)
        print(f"Resized to: {small_size}")
        
        # Resize back to larger size with nearest neighbor to maintain pixels
        img_pixelated = img_small.resize((512, 512), Image.NEAREST)
        print(f"Enlarged to: {img_pixelated.size}")
        
        # Reduce color palette for 8-bit effect
        img_pixelated = img_pixelated.quantize(colors=32)
        print(f"Reduced to 32 colors")
        
        # Save the result
        img_pixelated.save(output_path)
        print(f"Saved pixelated image to: {output_path}")
        
        return img_pixelated
    except Exception as e:
        print(f"Error pixelating image: {e}")
        return None

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 demo_pixelate.py <input_image> <output_image>")
        print("Example: python3 demo_pixelate.py photo.jpg pixelated_photo.png")
        return
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    
    if not os.path.exists(input_path):
        print(f"Error: Input file '{input_path}' does not exist")
        return
    
    print("=" * 50)
    print("🎮 Tamagotchi Image Pixelation Demo 🎮")
    print("=" * 50)
    
    result = pixelate_image(input_path, output_path)
    
    if result:
        print("\n✅ Pixelation complete!")
        print(f"📁 Original: {input_path}")
        print(f"📁 Pixelated: {output_path}")
        print("\nYou can now use this pixelated image in your Tamagotchi game!")
    else:
        print("\n❌ Pixelation failed!")

if __name__ == "__main__":
    main() 