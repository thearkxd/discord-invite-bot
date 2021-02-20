const mongoose = require("mongoose");
const settings = require("../configs/settings.json");

mongoose.connect(settings.mongoUrl, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useFindAndModify: false,
})
.then(() => console.log("Connected to DB"))
.catch((err) => console.error("DB Connection Error:" + err));