# How to Update Cline MCP Settings

To use the Shopmium MCP Server with Cline, you need to update your Cline MCP settings. Here's how:

## 1. Find your Cline MCP settings file

The Cline MCP settings file is typically located at:

- Windows: `%APPDATA%\Claude\mcp-settings.json`
- macOS: `~/Library/Application Support/Claude/mcp-settings.json`
- Linux: `~/.config/Claude/mcp-settings.json`

## 2. Add the Shopmium MCP Server to your settings

Open the file in a text editor and add the following to the `mcpServers` section:

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

Make sure to update the path in the `args` array to match the location where you installed the Shopmium MCP Server.

## 3. Save the file and restart Cline

After saving the file, restart Cline to apply the changes.

## 4. Test the server

You can test the server by asking Cline to:

```
Launch Shopmium and navigate to the Reimburse tab.
```

Cline should now be able to use the Shopmium MCP Server to control the Shopmium app without having to rediscover package names or UI element coordinates.