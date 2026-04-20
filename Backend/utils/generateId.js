const { v4: uuidv4 } = require("uuid");

const generateId = () => {
    return "SV-" + uuidv4().slice(0, 6);
};

module.exports = generateId;