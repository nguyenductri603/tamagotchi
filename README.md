# 🎮 8-Bit Tamagotchi Web Game

A nostalgic web-based Tamagotchi game with retro 8-bit graphics and character customization features.

## ✨ Features

- **8-bit Style Graphics**: Retro pixel art aesthetic with classic gaming fonts
- **Custom Character Images**: Upload your own images that get automatically converted to pixelated 8-bit style
- **Real-time Pet Care**: Monitor and maintain your pet's hunger, happiness, health, and energy
- **Interactive Actions**: Feed, play, heal, and let your pet sleep
- **Mini-Games**: Three exciting games where your Tamagotchi is the main character
  - **🟡 Pac-Man Adventure**: Navigate mazes, avoid ghosts, collect dots
  - **🐍 Snake Challenge**: Grow your Tamagotchi snake by eating food
  - **🧠 Memory Match**: Test your memory with Tamagotchi-themed cards
- **Pet Aging System**: Watch your Tamagotchi grow older over time
- **Responsive Design**: Works on desktop and mobile devices
- **Pet Naming**: Customize your pet's name
- **Game Persistence**: Stats continue to decay even when you're away

## 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Game**:
   ```bash
   python app.py
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:5000`

## 🎯 How to Play

### Basic Care
- **🍎 Feed**: Increases hunger and slightly improves health
- **🎯 Play**: Boosts happiness but consumes energy
- **💤 Sleep**: Restores energy and improves health
- **💊 Heal**: Directly improves health when your pet is sick

### Character Customization
1. Click the **📷 CUSTOMIZE** button
2. Upload any image file (JPG, PNG, etc.)
3. The image will be automatically converted to pixelated 8-bit style
4. Your custom character will replace the default emoji

### Pet Management
- Click on your pet's name to rename it
- Monitor the four status bars: Hunger, Happiness, Health, Energy
- Keep all stats above 20% to maintain good health
- If health reaches 0%, your Tamagotchi will die

### Mini-Games
Play fun retro games where your Tamagotchi is the star!

#### 🟡 Pac-Man Adventure
- Your Tamagotchi becomes Pac-Man (or uses your custom image)
- Navigate the maze using WASD or Arrow Keys
- Collect all dots while avoiding colorful ghosts
- **Rewards**: Up to 30 happiness points based on score
- **Energy Cost**: 5 points per game

#### 🐍 Snake Challenge  
- Control your Tamagotchi snake to eat food and grow
- Use WASD or Arrow Keys to change direction
- Don't hit walls or your own tail!
- **Win Condition**: Fill 30% of the board with your snake
- **Rewards**: Up to 25 happiness points based on score
- **Energy Cost**: 3 points per game

#### 🧠 Memory Match
- Match pairs of Tamagotchi-themed cards (🐾, 🍎, 💤, 💊, etc.)
- Click cards to flip them and find matching pairs
- Your custom Tamagotchi image appears on the 🐾 cards
- **Rewards**: Up to 20 happiness points, bonus for fewer moves
- **Energy Cost**: 2 points per game (brain games are less tiring!)

### Game Mechanics
- Stats automatically decay over time (every 30 seconds)
- Health decreases faster when hunger or happiness are low
- Age increases gradually as time passes
- The game continues running even when the browser tab is inactive

## 🛠️ Technical Details

### Backend (Python/Flask)
- **Flask**: Web framework for handling routes and API endpoints
- **Pillow (PIL)**: Image processing for pixelation effects
- **Real-time Updates**: Automatic stat decay system
- **File Upload**: Secure image upload with size limits

### Frontend (HTML/CSS/JavaScript)
- **Retro Styling**: 8-bit inspired UI with pixel fonts
- **Responsive Design**: Grid-based layout that works on all devices
- **Real-time Updates**: JavaScript polling for live stat updates
- **Image Rendering**: Pixelated image display with CSS filters

### Image Processing Pipeline
1. User uploads image → Flask receives file
2. Image resized to 64x64 pixels with nearest-neighbor scaling
3. Enlarged to 512x512 while maintaining pixel boundaries
4. Color palette reduced to 32 colors for authentic 8-bit look
5. Converted to base64 and sent to frontend

## 📁 Project Structure

```
tamagotchi/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── start_game.sh      # Easy startup script
├── demo_pixelate.py   # Standalone image pixelation demo
├── static/            # JavaScript game files
│   ├── pacman.js      # Pac-Man mini-game
│   ├── snake.js       # Snake mini-game
│   └── memory.js      # Memory matching mini-game
├── templates/
│   └── index.html     # Game interface with all mini-games
├── uploads/           # Temporary image storage
└── README.md          # This file
```

## 🎨 Customization

### Adjusting Game Balance
Edit the `Tamagotchi` class in `app.py`:
- Modify decay rates in `update_stats()`
- Change action effects in `feed()`, `play()`, `sleep()`, `heal()`
- Adjust update frequency (default: 30 seconds)

### Styling Changes
Modify the CSS in `templates/index.html`:
- Change color schemes
- Adjust pixel sizes
- Modify button styles and layouts

### Image Processing
Adjust pixelation in the `pixelate_image()` function:
- Change `small_size` for different pixel density
- Modify `colors` parameter for color palette size
- Adjust final image size

## 🔧 Configuration

### Environment Variables
- `FLASK_ENV`: Set to `development` for debug mode
- `UPLOAD_FOLDER`: Custom upload directory (default: `uploads/`)
- `MAX_CONTENT_LENGTH`: Maximum file upload size (default: 16MB)

### Port Configuration
The game runs on port 5000 by default. To change:
```python
app.run(debug=True, host='0.0.0.0', port=YOUR_PORT)
```

## 🐛 Troubleshooting

### Common Issues

1. **Image Upload Fails**:
   - Check file format (JPG, PNG supported)
   - Ensure file size is under 16MB
   - Verify uploads directory permissions

2. **Stats Not Updating**:
   - Check browser console for JavaScript errors
   - Ensure Flask server is running
   - Try refreshing the page

3. **Pixelation Not Working**:
   - Verify Pillow installation
   - Check image file integrity
   - Look for Python errors in terminal

## 🎮 Game Tips

### Pet Care
- Check on your pet regularly to prevent stats from getting too low
- Balance all four stats - neglecting any one can lead to health problems
- Use the sleep action when energy is low to restore it efficiently
- Custom images work best with clear, simple designs
- The game is designed to be challenging - keeping a Tamagotchi alive requires attention!

### Mini-Game Strategy
- **Save energy for games**: Don't play when energy is too low
- **Pac-Man**: Focus on clearing one section at a time, use power pellets wisely
- **Snake**: Plan your path ahead, don't trap yourself in corners
- **Memory**: Try to remember card positions, fewer moves = higher score
- **Best happiness boost**: Play mini-games when your pet is happy and energetic!

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

---

**Have fun raising your 8-bit companion!** 🐾 