const commands = {
    リアクション(stream, note, emojis) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)]
        stream.postReaction(note?.id, `:${emoji?.name}:`)
    },
    フォローして(stream, note) {
        stream.postReaction(note?.id, `👌`)
        stream.postFollow(note?.user?.id)
    },
    にゃーん(stream, note) {
        stream.postReaction(note?.id, `🐈`)
    },
}

class MentionHandler {
    constructor(stream, emojis) {
        this.stream = stream
        this.emojis = emojis
    }

    emoji(emojis) {
        this.emojis = emojis
    }

    push(note) {
        if (this.stream.me?.id === note?.user?.id) return //if me
        if (!note?.mentions?.includes(this.stream.me?.id)) return //if include my id(not)

        const re = new RegExp(
            `@${this.stream.me?.username}?(@${this.stream.host})`
        )

        const text = note?.text.toString().toLowerCase().replace(re, "") //get text(no mention)

        if (!Object.keys(commands).find((name) => text.includes(name)))
            return this.stream.postReaction(note?.id, `❤`)

        const command =
            commands[Object.keys(commands).find((name) => text.includes(name))]

        if (command) return command(this.stream, note, this.emojis)
    }
}

module.exports = MentionHandler
