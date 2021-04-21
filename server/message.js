module.exports = class Message {
    constructor(type, text, sender) {
        this.type = type;
        this.text = text;
        this.from = sender;

        this.time = Number(new Date());
    }
};
