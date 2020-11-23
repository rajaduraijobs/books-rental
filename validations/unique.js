module.exports = function(name, Model) {
    return Model.findOne({ name: name });;
}
