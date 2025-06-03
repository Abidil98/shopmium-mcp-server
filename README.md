# Shopmium MCP Server

A custom MCP server that provides high-level tools for controlling Shopmium and Quoty apps on Android emulators.

## Installation

```bash
# Clone the repository
git clone https://github.com/Abidil98/shopmium-mcp-server.git

# Navigate to the directory
cd shopmium-mcp-server

# Install dependencies
npm install
```

## Usage

### Starting the server

```bash
npm start
```

### Adding to Cline MCP settings

Add the following to your Cline MCP settings file:

```json
"github.com/Abidil98/shopmium-mcp-server": {
  "timeout": 60,
  "command": "node",
  "args": [
    "C:/Users/Admin/shopmium-mcp-server/index.js"
  ],
  "transportType": "stdio"
}
```

## Available Tools

### select_device

Select an Android device to use.

```json
{
  "device": "emulator-5554"  // Optional, defaults to emulator-5554
}
```

### launch_shopmium

Launch the Shopmium app.

```json
{}
```

### launch_quoty

Launch the Quoty app.

```json
{}
```

### shopmium_navigate_to_tab

Navigate to a specific tab in the Shopmium app.

```json
{
  "tab": "reimburse"  // One of: offers, categories, reimburse, loyaltyCards, purchases
}
```

### shopmium_navigate_to_top_tab

Navigate to a specific top tab in the Shopmium app.

```json
{
  "tab": "home"  // One of: home, shopmiumParty, newItems, laundryCare
}
```

### take_screenshot

Take a screenshot of the current screen.

```json
{}
```

### swipe_screen

Swipe up or down on the screen.

```json
{
  "direction": "up"  // One of: up, down
}
```

### click_at_coordinates

Click at specific coordinates on the screen.

```json
{
  "x": 100,
  "y": 200
}
```

### type_text

Type text into the focused element.

```json
{
  "text": "Hello, world!",
  "submit": true  // Optional, defaults to false
}
```

### terminate_app

Terminate an app.

```json
{
  "app": "shopmium"  // One of: shopmium, quoty
}
```

## Example Usage in Cline

```
I want to launch Shopmium and navigate to the Reimburse tab.
```

The LLM will use the custom MCP server to:
1. Select the device
2. Launch Shopmium
3. Navigate to the Reimburse tab

All without having to rediscover package names or UI element coordinates.