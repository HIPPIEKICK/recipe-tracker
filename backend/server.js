// Import necessary libraries and modules
import express from "express" // Import the Express.js framework
import cors from "cors" // Import the CORS middleware
import mongoose from "mongoose"
import dotenv from "dotenv" // Import dotenv for environment variables
dotenv.config() // Load environment variables from the .env file

// Defines the port the app will run on. Defaults to 8080, but can be overridden
const port = process.env.PORT || 8080 // Set the port number for the server
const app = express() // Create an instance of the Express application

// Add middlewares to enable cors and json body parsing
app.use(cors()) // Enable CORS (Cross-Origin Resource Sharing)
app.use(express.json()) // Parse incoming JSON data
app.use(express.urlencoded({ extended: false })) // Parse URL-encoded data
//app.use(express.static("public"))

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/recipes"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Recipe = mongoose.model("Recipe", {
  id: Number,
  name: String,
  ingredients: String,
  instructions: String,
  imageURL: String
})

app.get("/", (req, res) => {
  res.send("Hello World! Add some docs here")
})

app.get("/recipes", async (req, res) => {
  const recipes = await Recipe.find({})
  res.json(recipes)
})

app.post("/recipes", async (req, res) => {
  //Get info sent by client to our API endpoint
  const { name, ingredients, instructions, imageURL } = req.body
  //Use our mongoose model to create a new database entry
  const recipe = new Recipe({ name, ingredients, instructions, imageURL })
  try {
    //Sucess case
    const savedRecipe = await recipe.save()
    res.status(201).json(recipe)
  }
  catch (err) {
    res.status(400).json({ message: "Couldn't save recipe", error: err.errors })
  }
})

// listen for reqs
const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port)
})

