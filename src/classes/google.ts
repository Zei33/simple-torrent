const path = require("node:path");
const fs = require("node:fs");

const { JWT } = require("google-auth-library");
//const key = require(path.join(path.dirname(require.main.filename), "listener.json"));

import { Listener } from "./google/listener";

class Google {
	static async credentials(){
		const key = JSON.parse(fs.readFileSync(path.join(process.cwd(), "listener.json")));
		
		const auth = new JWT({ 
			email: key.client_email, 
			key: key.private_key, 
			keyId: key.private_key_id,
			scopes: ['https://www.googleapis.com/auth/cloud-platform'] 
		});
		
		return auth.getCredentials();
	}
}

export {
	Google,
	Listener
}