const { createServer, defineTools } = require('@modelcontextprotocol/server-sdk');
const { spawn } = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// App package names
const PACKAGES = {
  SHOPMIUM: 'com.shopmium',
  QUOTY: 'fr.laposte.quoty'
};

// UI Element coordinates for Shopmium
const SHOPMIUM_UI = {
  // Bottom navigation buttons
  bottomNav: {
    offers: { x: 67, y: 2300 },
    categories: { x: 252, y: 2300 },
    reimburse: { x: 460, y: 2300 },
    loyaltyCards: { x: 686, y: 2300 },
    purchases: { x: 927, y: 2300 }
  },
  // Top navigation tabs
  topNav: {
    home: { x: 25, y: 254 },
    shopmiumParty: { x: 210, y: 254 },
    newItems: { x: 549, y: 254 },
    laundryCare: { x: 811, y: 254 }
  }
};

/**
 * Execute a mobile MCP command
 * @param {string} toolName - The mobile MCP tool name
 * @param {object} args - The arguments for the tool
 * @returns {Promise<any>} - The result of the command
 */
async function executeMobileMcpCommand(toolName, args) {
  try {
    const command = `npx -y @mobilenext/mobile-mcp@latest ${toolName} '${JSON.stringify(args)}'`;
    console.log(`Executing: ${command}`);
    
    const { stdout, stderr } = await exec(command);
    
    if (stderr) {
      console.error(`Error: ${stderr}`);
    }
    
    try {
      return JSON.parse(stdout);
    } catch (e) {
      return stdout;
    }
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    throw error;
  }
}

// Define the tools for our custom MCP server
const tools = defineTools({
  // Tool to select a device
  select_device: {
    description: 'Select an Android device to use',
    input: {
      type: 'object',
      properties: {
        device: {
          type: 'string',
          description: 'The device ID to select (default: emulator-5554)'
        }
      }
    },
    handler: async ({ device = 'emulator-5554' }) => {
      return executeMobileMcpCommand('mobile_use_device', {
        device,
        deviceType: 'android'
      });
    }
  },
  
  // Tool to launch Shopmium app
  launch_shopmium: {
    description: 'Launch the Shopmium app',
    input: {
      type: 'object',
      properties: {}
    },
    handler: async () => {
      return executeMobileMcpCommand('mobile_launch_app', {
        packageName: PACKAGES.SHOPMIUM
      });
    }
  },
  
  // Tool to launch Quoty app
  launch_quoty: {
    description: 'Launch the Quoty app',
    input: {
      type: 'object',
      properties: {}
    },
    handler: async () => {
      return executeMobileMcpCommand('mobile_launch_app', {
        packageName: PACKAGES.QUOTY
      });
    }
  },
  
  // Tool to navigate to a specific tab in Shopmium
  shopmium_navigate_to_tab: {
    description: 'Navigate to a specific tab in the Shopmium app',
    input: {
      type: 'object',
      properties: {
        tab: {
          type: 'string',
          enum: ['offers', 'categories', 'reimburse', 'loyaltyCards', 'purchases'],
          description: 'The tab to navigate to'
        }
      },
      required: ['tab']
    },
    handler: async ({ tab }) => {
      const tabCoordinates = SHOPMIUM_UI.bottomNav[tab];
      if (!tabCoordinates) {
        throw new Error(`Unknown tab: ${tab}`);
      }
      
      return executeMobileMcpCommand('mobile_click_on_screen_at_coordinates', {
        x: tabCoordinates.x,
        y: tabCoordinates.y
      });
    }
  },
  
  // Tool to navigate to a specific top tab in Shopmium
  shopmium_navigate_to_top_tab: {
    description: 'Navigate to a specific top tab in the Shopmium app',
    input: {
      type: 'object',
      properties: {
        tab: {
          type: 'string',
          enum: ['home', 'shopmiumParty', 'newItems', 'laundryCare'],
          description: 'The top tab to navigate to'
        }
      },
      required: ['tab']
    },
    handler: async ({ tab }) => {
      const tabCoordinates = SHOPMIUM_UI.topNav[tab];
      if (!tabCoordinates) {
        throw new Error(`Unknown tab: ${tab}`);
      }
      
      return executeMobileMcpCommand('mobile_click_on_screen_at_coordinates', {
        x: tabCoordinates.x,
        y: tabCoordinates.y
      });
    }
  },
  
  // Tool to take a screenshot
  take_screenshot: {
    description: 'Take a screenshot of the current screen',
    input: {
      type: 'object',
      properties: {}
    },
    handler: async () => {
      return executeMobileMcpCommand('mobile_take_screenshot', {});
    }
  },
  
  // Tool to swipe up or down
  swipe_screen: {
    description: 'Swipe up or down on the screen',
    input: {
      type: 'object',
      properties: {
        direction: {
          type: 'string',
          enum: ['up', 'down'],
          description: 'The direction to swipe'
        }
      },
      required: ['direction']
    },
    handler: async ({ direction }) => {
      return executeMobileMcpCommand('swipe_on_screen', {
        direction
      });
    }
  },
  
  // Tool to click at specific coordinates
  click_at_coordinates: {
    description: 'Click at specific coordinates on the screen',
    input: {
      type: 'object',
      properties: {
        x: {
          type: 'number',
          description: 'The x coordinate'
        },
        y: {
          type: 'number',
          description: 'The y coordinate'
        }
      },
      required: ['x', 'y']
    },
    handler: async ({ x, y }) => {
      return executeMobileMcpCommand('mobile_click_on_screen_at_coordinates', {
        x, y
      });
    }
  },
  
  // Tool to type text
  type_text: {
    description: 'Type text into the focused element',
    input: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'The text to type'
        },
        submit: {
          type: 'boolean',
          description: 'Whether to submit the text'
        }
      },
      required: ['text']
    },
    handler: async ({ text, submit = false }) => {
      return executeMobileMcpCommand('mobile_type_keys', {
        text,
        submit
      });
    }
  },
  
  // Tool to terminate an app
  terminate_app: {
    description: 'Terminate an app',
    input: {
      type: 'object',
      properties: {
        app: {
          type: 'string',
          enum: ['shopmium', 'quoty'],
          description: 'The app to terminate'
        }
      },
      required: ['app']
    },
    handler: async ({ app }) => {
      const packageName = app === 'shopmium' ? PACKAGES.SHOPMIUM : PACKAGES.QUOTY;
      
      return executeMobileMcpCommand('mobile_terminate_app', {
        packageName
      });
    }
  }
});

// Create and start the MCP server
const server = createServer({
  tools,
  serverName: 'github.com/Abidil98/shopmium-mcp-server'
});

server.start();
console.log('Shopmium MCP Server started');