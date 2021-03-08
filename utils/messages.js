const moment = require(`moment`);

formatMessage = (userName, text) => {
    return{
        userName,
        text,
        time: moment().format(`h:mm:a`)
    };
}

exports.format = formatMessage;