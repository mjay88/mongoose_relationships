const mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose
	.connect("mongodb://localhost:27017/relationshipDemo", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("MONGO CONNECTION OPEN!!!");
	})
	.catch((err) => {
		console.log("OH NO MONGO CONNECTION ERROR!!!!");
		console.log(err);
	});

const productSchema = new Schema({
	name: String,
	price: Number,
	season: {
		type: String,
		enum: ["Spring", "Summer", "Fall", "Winter"],
	},
});

const farmSchema = new Schema({
	name: String,
	city: String,
	//an array of object ids and each one represents an actual product model
	products: [{ type: Schema.Types.ObjectId, ref: "Product" }], //union, equal to referncing foriegn key in sql
});

const Product = mongoose.model("Product", productSchema); // what we are referencing in farm schema
const Farm = mongoose.model("Farm", farmSchema);

// Product.insertMany([
//     { name: 'Goddess Melon', price: 4.99, season: 'Summer' },
//     { name: 'Sugar Baby Watermelon', price: 4.99, season: 'Summer' },
//     { name: 'Asparagus', price: 3.99, season: 'Spring' },
// ])

const makeFarm = async () => {
	const farm = new Farm({ name: "Full Belly Farms", city: "Guinda, CA" });
	const melon = await Product.findOne({ name: "Goddess Melon" });
	farm.products.push(melon); //just pushing the object ID
	await farm.save();
	console.log(farm);
};

const addProduct = async () => {
	const farm = await Farm.findOne({ name: "Full Belly Farms" });
	const watermelon = await Product.findOne({ name: "Sugar Baby Watermelon" });
	farm.products.push(watermelon);
	await farm.save();
	console.log(farm);
};

Farm.findOne({ name: "Full Belly Farms" }) //find farm
	.populate("products") //populate product field
	.then((farm) => console.log(farm));
