from flask import Flask, render_template, request, jsonify, send_file, send_from_directory
from PIL import Image
import os
import json
import time
import base64
from io import BytesIO
import threading

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create uploads directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('static', exist_ok=True)

class Tamagotchi:
    def __init__(self):
        self.name = "Tama"
        self.hunger = 50
        self.happiness = 50
        self.health = 50
        self.energy = 50
        self.age = 0
        self.last_update = time.time()
        self.custom_image = None
        self.is_alive = True
        
    def update_stats(self):
        """Update stats based on time passed"""
        current_time = time.time()
        time_diff = current_time - self.last_update
        
        if time_diff >= 30:  # Update every 30 seconds
            decay_amount = int(time_diff / 30)
            
            self.hunger = max(0, self.hunger - decay_amount)
            self.happiness = max(0, self.happiness - decay_amount)
            self.energy = max(0, self.energy - decay_amount * 0.5)
            
            # Health decreases if other stats are low
            if self.hunger < 20 or self.happiness < 20:
                self.health = max(0, self.health - decay_amount)
            
            # Age increases
            self.age += decay_amount * 0.1
            
            # Check if tamagotchi dies
            if self.health <= 0:
                self.is_alive = False
            
            self.last_update = current_time
    
    def feed(self):
        if self.is_alive:
            self.hunger = min(100, self.hunger + 20)
            self.health = min(100, self.health + 5)
    
    def play(self):
        if self.is_alive and self.energy > 10:
            self.happiness = min(100, self.happiness + 25)
            self.energy = max(0, self.energy - 10)
    
    def sleep(self):
        if self.is_alive:
            self.energy = min(100, self.energy + 30)
            self.health = min(100, self.health + 10)
    
    def heal(self):
        if self.is_alive:
            self.health = min(100, self.health + 30)
    
    def add_happiness(self, amount):
        """Add happiness from mini-games"""
        if self.is_alive:
            self.happiness = min(100, self.happiness + amount)
    
    def get_status(self):
        self.update_stats()
        return {
            'name': self.name,
            'hunger': self.hunger,
            'happiness': self.happiness,
            'health': self.health,
            'energy': self.energy,
            'age': round(self.age, 1),
            'is_alive': self.is_alive,
            'custom_image': self.custom_image
        }

# Global tamagotchi instance
tama = Tamagotchi()

def pixelate_image(image_path, pixel_size=8):
    """Convert image to pixelated 8-bit style"""
    try:
        # Open and resize image
        img = Image.open(image_path)
        
        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize to small size for pixelation
        small_size = (64, 64)
        img_small = img.resize(small_size, Image.NEAREST)
        
        # Resize back to larger size with nearest neighbor to maintain pixels
        img_pixelated = img_small.resize((512, 512), Image.NEAREST)
        
        # Reduce color palette for 8-bit effect
        img_pixelated = img_pixelated.quantize(colors=32)
        
        return img_pixelated
    except Exception as e:
        print(f"Error pixelating image: {e}")
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

@app.route('/status')
def get_status():
    return jsonify(tama.get_status())

@app.route('/action/<action_type>')
def perform_action(action_type):
    if action_type == 'feed':
        tama.feed()
    elif action_type == 'play':
        tama.play()
    elif action_type == 'sleep':
        tama.sleep()
    elif action_type == 'heal':
        tama.heal()
    
    return jsonify(tama.get_status())

@app.route('/minigame/complete', methods=['POST'])
def complete_minigame():
    data = request.get_json()
    game_type = data.get('game', '')
    score = data.get('score', 0)
    won = data.get('won', False)
    happiness_bonus = data.get('happiness_bonus', 0)
    
    if won and tama.is_alive:
        # Award happiness points for winning any mini-game
        tama.add_happiness(happiness_bonus)
        
        # Small energy cost for playing (different for each game)
        if game_type == 'pacman':
            tama.energy = max(0, tama.energy - 5)
        elif game_type == 'snake':
            tama.energy = max(0, tama.energy - 3)  # Less energy cost
        elif game_type == 'memory':
            tama.energy = max(0, tama.energy - 2)  # Least energy cost (brain game)
        
        print(f"Mini-game completed: {game_type}, Score: {score}, Happiness bonus: +{happiness_bonus}")
    
    return jsonify(tama.get_status())

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file:
        try:
            # Save original file
            filename = f"original_{int(time.time())}.png"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Pixelate the image
            pixelated_img = pixelate_image(filepath)
            if pixelated_img:
                # Save pixelated version
                pixelated_filename = f"pixelated_{int(time.time())}.png"
                pixelated_filepath = os.path.join(app.config['UPLOAD_FOLDER'], pixelated_filename)
                pixelated_img.save(pixelated_filepath)
                
                # Convert to base64 for web display
                buffer = BytesIO()
                pixelated_img.save(buffer, format='PNG')
                img_str = base64.b64encode(buffer.getvalue()).decode()
                
                tama.custom_image = f"data:image/png;base64,{img_str}"
                
                # Clean up original file
                os.remove(filepath)
                
                return jsonify({
                    'success': True,
                    'image': tama.custom_image
                })
            else:
                return jsonify({'error': 'Failed to process image'}), 500
                
        except Exception as e:
            return jsonify({'error': f'Error processing image: {str(e)}'}), 500

@app.route('/reset')
def reset_game():
    global tama
    tama = Tamagotchi()
    return jsonify(tama.get_status())

@app.route('/rename', methods=['POST'])
def rename_tamagotchi():
    data = request.get_json()
    if 'name' in data:
        tama.name = data['name'][:20]  # Limit name length
    return jsonify(tama.get_status())

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 