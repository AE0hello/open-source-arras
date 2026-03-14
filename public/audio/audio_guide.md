This guide demonstrates how to implement audio playback when players upgrade to specific tanks in a multiplayer tank game. The system uses server-side detection and client-side audio playback with proper broadcasting to all players.

## Architecture
- **Server-Side**: Detects tank upgrades and broadcasts commands to all clients
- **Client-Side**: Receives commands and plays audio files with proper browser compatibility
- **Audio Management**: Prevents audio stacking and handles browser autoplay restrictions

## Implementation Steps

### 1. Server-Side Upgrade Detection

**File**: `server/Game/entities/entity.js`

```javascript
// In the upgrade() method, after this.emit("upgrade", { body: this });

if (this.label === "The Immortal") {
  // Broadcast announcement to all players
  const playerName = this.name || "A warrior";
  const announcement = `${playerName} has ascended to The Immortal!`;
  global.gameManager.socketManager.broadcast(announcement);
  
  // Send audio command to all connected clients
  for (let client of global.gameManager.socketManager.clients) {
    if (client && client.talk) {
      client.talk("TIA");
    }
  }
}
```

**Key Points**:
- Use `this.label` to identify the specific tank
- `global.gameManager.socketManager.broadcast()` sends chat messages to all players
- Loop through `clients` array to send socket commands to individual players
- Use custom command codes (e.g., "TIA" = The Immortal Audio)

### 2. Client-Side Audio Handler

**File**: `public/client/socketinit.js`

```javascript
case 'TIA': { // The Immortal Audio
  try {
    // Stop existing audio to prevent stacking
    if (window.theImmortalAudio && !window.theImmortalAudio.paused) {
      window.theImmortalAudio.pause();
      window.theImmortalAudio.currentTime = 0;
    }
    
    // Create new audio element
    const audio = new Audio('/audio/songsgohere/theimmortal.mp3');
    audio.volume = 0.5;
    audio.loop = false;
    
    // Store globally for management
    window.theImmortalAudio = audio;
    
    // Clean up when song ends
    audio.addEventListener('ended', () => {
      window.theImmortalAudio = null;
    });
    
    // Play audio
    audio.play().catch(error => {
      console.log("Error playing audio:", error);
    });
  } catch (error) {
    console.log("Error loading audio:", error);
  }
} break;
```

**Key Points**:
- Place in the `incoming()` function's switch statement
- Use global window variable to track audio state
- Prevent stacking by stopping existing audio
- Set `loop = false` to prevent continuous playback
- Handle errors gracefully with try-catch blocks

**Requirements**:
- Audio files must be in public-facing directory
- Use absolute paths from web root (starting with `/`)
- Support common formats: MP3, WAV, OGG

### 3. Tank Definition Enhancement

**File**: `server/lib/definitions/entityAddons/[tankName].js`

```javascript
Class.theImmortal = {
  PARENT: "genericTank",
  LABEL: "The Immortal",  // Critical: Must match server-side check
  // ... other tank properties
};
```

**Critical Requirement**: The `LABEL` property must exactly match the string used in the server-side detection.

### 4. Handling New Players Joining After Tank Spawn

**Problem**: New players who join after a special tank (like The Immortal) has already spawned won't receive the audio or broadcast message.

**Solution**: Check for existing tanks when new players spawn and trigger audio/broadcast for them.

**File**: `server/Game/network/sockets.js`

```javascript
// In the initalizePlayer() method, after player spawning:

// Check if there are any existing immortals and send TIA packet if so (only for new players)
if (!socket.status.hasHeardImmortalMusic) {
  let immortalEntity = null;
  for (const entity of global.entities.values()) {
    if (entity.label === "The Immortal" && !entity.isDead()) {
      immortalEntity = entity;
      break;
    }
  }
  if (immortalEntity) {
    // Broadcast announcement to all players (including the new one)
    const playerName = immortalEntity.name || "A warrior";
    const announcement = `${playerName} has ascended to The Immortal!`;
    global.gameManager.socketManager.broadcast(announcement);
    
    // Send audio command to the new player only
    socket.talk("TIA");
    socket.status.hasHeardImmortalMusic = true;
  }
}
```

**Key Points**:
- Place this check **after** the player has been fully spawned
- Use `global.entities.values()` to iterate through all active entities
- Check `!entity.isDead()` to ensure the tank is still alive
- Use `socket.status.hasHeardImmortalMusic` flag to prevent repeated triggers on respawns
- Broadcast to **all players** (not just the new one) for consistency
- Send audio packet **only to the new player** to avoid restarting music for existing players
- Use the same `LABEL` matching and message format as the upgrade detection
- Flag prevents **session-wide** repeated audio (survives respawns)

### Multiple Tank Audio
```javascript
// Server-side
if (this.label === "The Immortal") {
  // ... TIA logic
}
if (this.label === "Another Tank") {
  for (let client of global.gameManager.socketManager.clients) {
    if (client && client.talk) {
      client.talk("ATA"); // Another Tank Audio
    }
  }
}

// Client-side
case 'TIA': { /* Immortal audio */ } break;
case 'ATA': { /* Another tank audio */ } break;
```

### Dynamic Audio Selection
```javascript
// Server-side with dynamic audio
const audioMap = {
  "The Immortal": "TIA",
  "Another Tank": "ATA"
};

if (audioMap[this.label]) {
  for (let client of global.gameManager.socketManager.clients) {
    if (client && client.talk) {
      client.talk(audioMap[this.label]);
    }
  }
}
```