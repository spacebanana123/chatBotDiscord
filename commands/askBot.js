const { SlashCommandBuilder } = require('discord.js');

async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	return result;
}

let past_user_input = [];
let generated_responses = [];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ask-bot')
		.setDescription('Replies with a response from the bot!')
        .addStringOption(option =>
            option
                .setName('text')
                .setDescription('The text to send to the bot')
                .setRequired(true)),
	async execute(interaction) {
		interaction.deferReply();
        query({
            "inputs": {
                "text": interaction.options.getString('text'),
                "past_user_inputs": past_user_input,
                "generated_responses": generated_responses,
            }}).then((result) => {
                past_user_input.push(interaction.options.getString('text'));
                generated_responses.push(result.generated_text);
                interaction.editReply(result.generated_text);
            });
	},
};
