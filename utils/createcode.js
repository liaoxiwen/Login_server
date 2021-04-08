module.exports = {
    createcode: function () {
        const code = parseInt(Math.random()*10000);
        return String(code);
    }
}