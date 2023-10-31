const path = require("node:path");

const { JWT } = require("google-auth-library");
const key = require(path.join(path.dirname(require.main.filename), "listener.json"));

const credentials = async () => {
	const auth = new JWT({ email: key.client_email, key: key.private_key, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
	return await auth.getCredentials();
}

module.exports = {
	credentials,
	Listener: require(`./google/listener`)
};