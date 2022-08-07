import { Message } from "discord.js";

/**
 * @param {Message} message
 */
export default (message) => {
	console.log(message.cleanContent)
}
