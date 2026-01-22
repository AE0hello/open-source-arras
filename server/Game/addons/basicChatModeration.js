// Very basic spam prevention.
// Adds a simple ratelimit for sending too many messages.
// Allows you to spam if you have the allowSpam flag in your permissions.

let recent = {},
	ratelimit = 3,
	decay = 10_000;

const bannedWords = [
	"fuck", "shit", "bitch", "asshole", "cunt", "nigger", "faggot", "retard", "whore", "slut",
];

const urlPattern = /(https?:\/\/|www\.)\S+/i;
const invitePattern = /(discord\.gg|discord\.com\/invite|t\.me\/|telegram\.me\/)/i;

const normalizeMessage = (message) => {
	let msg = message
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase();
	msg = msg
		.replace(/[@4]/g, "a")
		.replace(/[!1|]/g, "i")
		.replace(/[3]/g, "e")
		.replace(/[0]/g, "o")
		.replace(/[5$]/g, "s")
		.replace(/[7]/g, "t");
	msg = msg.replace(/[^a-z0-9]+/g, "");
	return msg;
};

Events.on('chatMessage', ({ message, socket, preventDefault, setMessage }) => {
	let perms = socket.permissions,
		id = socket.player.body.id;

	// Basic filtering for profanity/links/invites.
	let normalized = normalizeMessage(message);
	if (urlPattern.test(message) || invitePattern.test(message)) {
		preventDefault();
		socket.talk('m', Config.popup_message_duration, 'Links are not allowed.');
		return;
	}
	for (let word of bannedWords) {
		if (normalized.includes(word)) {
			setMessage(message.replace(new RegExp(word, "ig"), "*".repeat(word.length)));
			break;
		}
	}

	// They are allowed to spam ANYTHING they want INFINITELY.
	if (perms && perms.allowSpam) return;

	// If they're talking too much, they can take a break.
	// Fortunately, this returns false if 'recent[id] is 'undefined'.
	if (recent[id] >= ratelimit) {
		preventDefault(); // 'preventDefault()' prevents the message from being sent.
		socket.talk('m', Config.popup_message_duration, 'Please slow down!');
		return;
	}

	// The more messages they send, the higher this counts up.
	if (!recent[id]) {
		recent[id] = 0;
	}
	recent[id]++;

	// Let it decay so they can talk later.
	setTimeout(() => {
		recent[id]--;

		// memoree leak NOes!
		if (!recent[id]) {
			delete recent[id];
		}
	}, decay);

	// If message above the character limit, lets stop that from getting through
	if (message.length > 56) {
		preventDefault();
		socket.talk('m', Config.popup_message_duration, 'Too long!')
	}
});
