interface props {
	score: number;
}

export function init(this: props): void {
	this.score = 0;
}

export function on_message(
	this: props,
	messageId: hash,
	message: { score: number },
	_sender: url,
): void {
	if (messageId === hash('add_score')) {
		this.score += message.score;
		const scoreNode = gui.get_node('score');
		gui.set_text(scoreNode, `SCORE: ${this.score}`);
	}
}
