import { config } from "dotenv";
import ms from "ms";
import { Client, GatewayIntentBits, Formatters, PermissionFlagsBits, GuildMember, Collection, EmbedBuilder } from "discord.js";
import { Sequelize, DataTypes } from "sequelize";

config();

const awakeListeners = new Collection();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
});

const db = new Sequelize(process.env.DATABASE_URL, {
	logging: false,
	dialect: "postgres",
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false
		}
	}
});

const guilds = db.define("guilds", {
	guild_id: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	triggers: {
		type: DataTypes.STRING
	},
	channels: {
		type: DataTypes.STRING
	},
	master: {
		type: DataTypes.STRING
	}
}, {
	timestamps: false
});

const members = db.define("member", {
	guild_id: {
		type: DataTypes.STRING,
	},
	member_id: {
		type: DataTypes.STRING
	},
	score: {
		type: DataTypes.INTEGER
	}
}, {
	timestamps: false
});

client.once("ready", () => {
	console.log(`Logged in as ${client.user.username}!`);
	console.debug(`Intents: ${client.application.flags.toArray()}`);
});

/**
 * Temporal command handling
 */
client.on("messageCreate", async (message) => {
	// TODO: #2 Refactor commands.
	if (message.content.startsWith("pb!") || !message.author.bot) {
		const args = message.content.substring(3).trim().split(/ +/g);
		const command = args.shift().toLowerCase();

		if (!message.inGuild()) {
			await message.reply("Whoops, this command can only be ran from an guild!");
			return;
		}

		const guild = await getGuild(message.guildId);

		// Let's PLEASE get this working with DRY!
		switch (command) {
			case "dump": {
				if (!isAdmin(message.member)) {
					await message.reply("This command can only be run by an admin!");
					break;
				}
				switch (args[0]) {
					case undefined: {
						await message.reply("Usage: dump [guild|triggers|channels]");
						break;
					}
					case "guild": {
						await message.reply(Formatters.codeBlock(JSON.stringify(guild.toJSON())));
						break;
					}
					case "triggers":
					case "channels": {
						await message.reply(buildList(fromArray(guild.getDataValue(args[0]))));
						break;
					}
				}
				break;
			}

			case "addtrigger": {
				if (!isAdmin(message.member)) {
					await message.reply("This command can only be run by an admin!");
					break;
				}

				const array = fromArray(guild.getDataValue("triggers"));

				let trigger;

				if (args.length > 1) {
					trigger = args.join(" ").trim().toLowerCase();
				} else if (args.length === 1) {
					trigger = args[0].trim().toLowerCase();
				} else {
					await message.reply("You need to pass the trigger!");
					break;
				}

				if (array.includes(trigger)) {
					await message.reply("That trigger already exists!");
					break;
				}

				if (trigger.includes(",") || trigger === "") {
					await message.reply("Invalid trigger!");
					break;
				}

				array.push(trigger);

				await guild.update({
					triggers: toArray(array)
				});

				await message.reply("Created trigger at index `" + (array.length - 1) + "`: `" + trigger + "`!");

				break;
			}

			case "remtrigger": {
				if (!isAdmin(message.member)) {
					await message.reply("This command can only be run by an admin!");
					break;
				}

				const array = fromArray(guild.getDataValue("triggers"));

				let trigger;

				if (args.length >= 1) {
					trigger = Number(args[0]);
				} else {
					await message.reply("You need to pass the trigger index! Use `pb!dump triggers` for a list of triggers.");
					break;
				}

				if (array.length === 0) {
					await message.reply("No triggers found.");
					break;
				}

				if (trigger === undefined) {
					await message.reply("Not a number.");
					break;
				}

				console.debug("Array length: %d, trigger id: %d", array.length, trigger);

				if (array.length < trigger + 1) {
					await message.reply("That trigger doesn't exist!");
					break;
				}

				array.splice(trigger, 1)

				await guild.update({
					triggers: toArray(array)
				});

				await message.reply("Removed trigger at index `" + trigger + "`");

				break;
			}

			case "addchannel": {
				if (!isAdmin(message.member)) {
					await message.reply("This command can only be run by an admin!");
					break;
				}

				const array = fromArray(guild.getDataValue("channels"));

				/** @type {import("discord.js").Channel} */
				let channel;

				if (message.mentions.channels.size > 0) {
					// For clarity and to not clutter the codebase, only add the first mentioned channel.
					channel = message.mentions.channels.first();
				} else {
					await message.reply("You need to mention the channel!");
					break;
				}

				if (array.includes(channel.id)) {
					await message.reply("I already listen to that channel!");
					break;
				}

				array.push(channel.id);

				await guild.update({
					channels: toArray(array)
				});

				await message.reply("Now listening to channel <#" + channel.id + "> (" + channel.id + ") at index `" + (array.length - 1) + "`!");

				break;
			}

			case "remchannel": {
				if (!isAdmin(message.member)) {
					await message.reply("This command can only be run by an admin!");
					break;
				}

				const array = fromArray(guild.getDataValue("channels"));

				let channel;

				if (args.length >= 1) {
					channel = Number(args[0]);
				} else {
					await message.reply("You need to pass the channel index! Use `pb!dump channels` for a list of channels.");
					break;
				}

				if (array.length === 0) {
					await message.reply("No channels are listened to.");
					break;
				}

				if (channel === undefined) {
					await message.reply("Not a number.");
					break;
				}

				console.debug("Array length: %d, channel id: %d", array.length, channel);

				if (array.length < channel + 1) {
					await message.reply("That channel is not listened to!");
					break;
				}

				array.splice(channel, 1)

				await guild.update({
					channels: toArray(array)
				});

				await message.reply("Removed listened channel at index `" + channel + "`");

				break;
			}

			case "score": {
				const member = await getMember(message.guildId, message.author.id);
				const score = member.getDataValue("score");
				await message.reply("You have " + score + " points");
				break;
			}

			case "leaderboard": {
				// TODO: Support more than 10 members, could be done w/pagination and buttons.
				const members = await getTopMembers(message.guildId, 10);
				
				const embed = new EmbedBuilder();
				embed.setTitle("Leaderboard for " + message.guild.name);
				
				const names = [];
				members.forEach((member) => {
					names.push("<@" + member.getDataValue("member_id") + "> (" + member.getDataValue("score") + " points)")
				});

				embed.setDescription(names.join("\n"));

				await message.reply({ embeds: [embed] });
				break;
			}

			case "help": {
				await message.reply("Admin commands: `addtrigger, remtrigger, addchannel, remchannel, give, take, dump`\nUser commands: `score, leaderboard`\nPrefix: `pb!`")
				break;
			}
		}
	}
});

/**
 * Listener awaking
 */
client.on("messageCreate", async (message) => {
	if (message.inGuild()) {
		const guild = await getGuild(message.guildId);

		const triggers = fromArray(guild.getDataValue("triggers"));

		if (!message.author.bot) {
			if (isAdmin(message.member)) {
				if (!awakeListeners.has(message.guildId)) {
					if (triggers.some((trigger) => message.content.toLowerCase().includes(trigger))) {
						await message.react("👀");
						awakeListeners.set(message.guildId, {
							awakedAt: Date.now()
						})
					}
				}
			}
		}
	}
});

/**
 * User reaction
 */
client.on("messageCreate", async (message) => {
	if (!message.author.bot) {
		if (awakeListeners.has(message.guildId)) {
			console.debug("Possible pog in guild " + message.guildId);

			const guild = await getGuild(message.guildId);
			const channels = fromArray(guild.getDataValue("channels"));

			if (channels.some((channel) => channel === message.channelId)) {
				if (message.content.toLowerCase().includes("pog")) {
					console.debug("Pog in guild " + message.guildId);

					const member = await getMember(message.guildId, message.author.id);
					(await member.increment("score")).reload();

					await message.react("🎉");
					await message.reply("Congrats <@" + message.author.id + ">, you got 1 point from pogging! It took you " + parseDuration(Date.now() - awakeListeners.get(message.guildId).awakedAt) + " to do so!")
				}
			}
		}
	}
});

/**
 * Get or create an Pogbot guild from its id.
 * @param {string} id
 */
async function getGuild(id) {
	const [guild, created] = await guilds.findOrCreate({
		where: {
			guild_id: id
		},
		defaults: {
			guild_id: id,
			channels: "",
			triggers: "",
			master: ""
		}
	});

	if (created) {
		console.debug(`Created guild ${id}`);
	}

	return guild;
}

/**
 * Get or create an Pogbot member.
 * @param {string} guild
 * @param {string} user
 */
async function getMember(guild, user) {
	const [member, created] = await members.findOrCreate({
		where: {
			guild_id: guild,
			member_id: user
		},
		defaults: {
			guild_id: guild,
			member_id: user,
			score: 0
		}
	});

	if (created) {
		console.debug(`Created member ${user} in guild ${guild}`);
	}

	return member;
}

/**
 * Get the top members for an guild.
 * @param {string} guild 
 * @param {number?} count 
 */
async function getTopMembers(guild, count) {
	return await members.findAll({
		where: {
			guild_id: guild
		},
		order: [
			[
				"id", "ASC"
			]
		],
		limit: count ?? 5
	})
}

/**
 * Milliseconds to human-friendly format.
 * @param {number} milliseconds
 */
function parseDuration(milliseconds) {
	return ms(milliseconds)
}

/**
 * @param {GuildMember} member 
 */
function isAdmin(member) {
	return member.permissions.has(PermissionFlagsBits.ManageGuild, true);
}

/**
 * Build an numbered list from an array.
 * @param {string[]} array 
 */
function buildList(array) {
	return Formatters.codeBlock(array.map((value, index) => {
		return `[${index}] ${value}`
	}).join("\n"));
}

/**
 * Convert from an stringified array.
 * @param {string} stringified
 */
function fromArray(stringified) {
	if (stringified === "") return [];
	return stringified.split(",");
}

/**
 * Convert to an stringified array.
 * @param {string[]} array
 */
function toArray(array) {
	return array.join();
}

db.sync().then(() => {
	console.log("Synced database!");
});


client.login(process.env.TOKEN).catch(err => {
	console.error("Could not login! " + err);
});
