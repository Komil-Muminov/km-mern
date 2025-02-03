import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cors from "cors";

// Подключение к MongoDB (строка подключения захардкодена)
mongoose
	.connect("mongodb://localhost:27017/komilff", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("БД монго подключен"))
	.catch(() => console.log("БД монго ошибка при подключении"));

// Создаём приложение Express
const app = express();

// Middleware для парсинга JSON и URL-encoded данных
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

// Обработка запроса на получение шрифта (возвращаем пустой ответ с кодом 204)
app.get("/type-font/Colfax-Medium.woff", (req, res) => {
	res.status(204).send();
});

// Определение схемы пользователя для MongoDB
const userScheme = new mongoose.Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
});

// Создание модели пользователя
const userModel = mongoose.model("user", userScheme);

// Роут для регистрации пользователя
app.post("/regme", async (req, res) => {
	try {
		const { username, email, password } = req.body;
		if ([username, email].includes(undefined)) {
			return res.status(400).send("Обязательные поля отсутствуют");
		}

		if (await userModel.findOne({ email })) {
			return res.status(400).send("Такой email уже есть");
		} else {
			await userModel.create({ username, email, password });
			return res.status(200).send("Пользователь успешно добавлен");
		}
	} catch (error) {
		return res.status(500).send("Ошибка в сервере");
	}
});

// Экспортируем приложение вместо прямого запуска сервера
export default app;
