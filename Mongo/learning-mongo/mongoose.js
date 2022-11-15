const mongoose = require('mongoose');

async function main() {

// Connect to the server and set the database to cats
await mongoose.connect("mongodb://localhost:27017/testDB");

// Create a schema to represent the collection
const kittySchema = new mongoose.Schema({
  name: String,
 });

// Create a function that is associated with the schema
kittySchema.methods.speak = function speak() {
  console.log('Meow name is ' + (this.name || 'secret'));
};

// Bind the schema to a Mongo collection name
const Kitten = mongoose.model('kitten', kittySchema);

// Add some kittens
await new Kitten({ name: 'hairball' }).save();
await new Kitten({ name: 'fluffy' }).save();
await new Kitten().save();

// Do a query on the kitten collection and speak the name of each kitten that is found
const kittens = await Kitten.find();
kittens.forEach((kitten) => {
  kitten.speak();
});
}

main().catch(console.error);