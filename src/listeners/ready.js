export default (client) => {
	console.log("Logged in as %s!", client.user.username);
	console.debug("Intents: %s", client.application.flags.toArray());
}
