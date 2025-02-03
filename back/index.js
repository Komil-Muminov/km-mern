import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// 27017 mongoDB
mongoose
	.connect("mongodb://localhost:27017/komilff")
	.then(() => console.log(`БД монго подключен`))
	.catch(() => console.log(`БД монго ошибка при подключение`));
// ---------------------------------------------------------------------------

// Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройка CORS
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

app.get("/type-font/Colfax-Medium.woff", (req, res) => {
	res.status(204).send(); // Возвращает "ничего", но без ошибки 404
});
// MongoDB
const userScheme = new mongoose.Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
});

const userModel = mongoose.model("user", userScheme);

// Запросы

app.post("/regme", async (req, res) => {
	try {
		const { username, email, password } = req.body;
		if ([username, email].includes(undefined)) {
			return res.status(400).send(`Объязательные поля отсутсвуют`);
		}

		if (await userModel.findOne({ email })) {
			return res.status(400).send(`Такой email уже есть`);
		} else {
			await userModel.create({ username, email, password });
			return res.status(200).send(`Пользователь успешно добавлен`);
		}
	} catch (error) {
		console.error("Ошибка сервера:", error);
		return res.status(500).send("Ошибка в сервере");
	}
});
// Запуск сервера
const PORT = process.env.PORT || 4000;
app.listen(PORT || 3000, () => {
	console.log(`Сервер запущен по адресу: http://localhost:${PORT || 3000}`);
});
