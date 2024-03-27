import express from "express";
import fs from "fs/promises";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

module.exports = app;

let data;

async function loadArticles() {
	try {
		const rawData = await fs.readFile("articles.json", "utf8");
		return JSON.parse(rawData);
	} catch (error) {
		console.error("Error reading the JSON file:", error);
		return []; // Return an empty array in case of error
	}
}

// Home page that lists articles
app.get("/", async (req, res) => {
	const articles = await loadArticles();
	const mainFeaturedArticle = articles.find((article) => article.id === "1");
	res.render("index.ejs", {
		articles: articles,
		mainFeaturedArticle: mainFeaturedArticle,
	});
});

// Individual post page
app.get("/post/:id", async (req, res) => {
	const articles = await loadArticles();
	const article = articles.find((article) => article.id === req.params.id);
	if (article) {
		res.render("article.ejs", { article: article });
	} else {
		res.status(404).send("Article not found");
	}
});

app.listen(port, () => {
	console.log(`Server on ${port}`);
});
