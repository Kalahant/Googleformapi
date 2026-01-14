// api/form-submission.js
// Vercel serverless function for Discord form submissions

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Discord client cache
let client = null;
let clientReady = false;

// Initialize Discord client
async function getDiscordClient() {
    if (client && clientReady) {
        return client;
    }

    client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages
        ]
    });

    // Login and wait for ready
    await client.login(process.env.DISCORD_TOKEN);
    
    // Wait for ready event
    await new Promise((resolve) => {
        if (client.isReady()) {
            clientReady = true;
            resolve();
        } else {
            client.once('ready', () => {
                clientReady = true;
                resolve();
            });
        }
    });

    return client;
}

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    // Handle OPTIONS request (CORS preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Verify secret key for security
        const authHeader = req.headers.authorization;
        if (authHeader !== `Bearer ${process.env.API_SECRET}`) {
            return res.status(401).json({ error: 'Unauthorized - Invalid API secret' });
        }

        const { embed } = req.body;

        if (!embed) {
            return res.status(400).json({ error: 'No embed data provided' });
        }

        // Get the Discord client
        const discordClient = await getDiscordClient();

        // Get the channel
        const channelId = process.env.FORM_SUBMISSION_CHANNEL_ID;
        if (!channelId) {
            return res.status(500).json({ error: 'FORM_SUBMISSION_CHANNEL_ID not configured in environment variables' });
        }

        const channel = await discordClient.channels.fetch(channelId);
        
        if (!channel) {
            return res.status(404).json({ error: 'Channel not found - check FORM_SUBMISSION_CHANNEL_ID' });
        }

        // Create the embed
        const discordEmbed = new EmbedBuilder()
            .setColor(embed.color || 0x0099ff)
            .setTitle(embed.title || 'Form Submission')
            .setDescription(embed.description || '')
            .setTimestamp();

        // Add fields from the form
        if (embed.fields && Array.isArray(embed.fields)) {
            embed.fields.forEach(field => {
                discordEmbed.addFields({
                    name: field.name,
                    value: field.value,
                    inline: field.inline || false
                });
            });
        }

        // Add thumbnail if provided
        if (embed.thumbnail) {
            discordEmbed.setThumbnail(embed.thumbnail);
        }

        // Add image if provided
        if (embed.image) {
            discordEmbed.setImage(embed.image);
        }

        // Add footer if provided - FIXED HERE
        if (embed.footer) {
            if (typeof embed.footer === 'string') {
                // Simple string footer
                discordEmbed.setFooter({ text: embed.footer });
            } else if (typeof embed.footer === 'object' && embed.footer.text) {
                // Object with text and optional iconURL
                const footerOptions = { text: embed.footer.text };
                if (embed.footer.iconURL) {
                    footerOptions.iconURL = embed.footer.iconURL;
                }
                discordEmbed.setFooter(footerOptions);
            }
        }

        // Create buttons
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('form_allow')
                    .setLabel('Allow')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('form_deny')
                    .setLabel('Deny')
                    .setStyle(ButtonStyle.Danger)
            );

        // Send the message
        const message = await channel.send({
            embeds: [discordEmbed],
            components: [row]
        });

        res.status(200).json({ 
            success: true, 
            messageId: message.id,
            channelId: channel.id
        });

    } catch (error) {
        console.error('Error processing form submission:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            details: error.message 
        });
    }
};
