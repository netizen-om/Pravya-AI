// test-direct-api.ts
import { setDefaultResultOrder } from "dns";
setDefaultResultOrder("ipv4first"); // Keep this just in case

import dotenv from "dotenv";
dotenv.config();

// We need node-fetch for older Node.js versions. 
// If you are on Node 18+, you can remove this import.
import fetch from "node-fetch";

const apiKey = process.env.GOOGLE_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${apiKey}`;

const testDirectApiCall = async () => {
  if (!apiKey) {
    console.error("ERROR: GOOGLE_API_KEY is not set in your .env file.");
    return;
  }
  
  try {
    console.log("Attempting a direct API call to Google without LangChain...");

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "models/embedding-001",
        content: {
          parts: [{
            text: "This is a simple test sentence."
          }]
        }
      }),
    });

    console.log("Received a response from the server!");
    console.log("Status Code:", response.status, response.statusText);

    if (response.ok) {
        const data = await response.json();
        console.log("API call successful! ✅");
        console.log("Vector dimensions:", data.embedding.value.length);
    } else {
        const errorData = await response.text();
        console.error("API call failed with an error response. ❌");
        console.error("Error details:", errorData);
    }

  } catch (error) {
    console.error("The direct API call threw an error:");
    console.error(error);
  }
};

testDirectApiCall();