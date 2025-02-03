import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { existsSync, mkdirSync } from "fs";
import path from "path";
import multer from "multer";

// Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//MongoDB-conection and cors
// Настройка CORS для всех источников
app.use(
	cors({
		origin: "*", // Разрешаем доступ с любого источника (для разработки)
		methods: ["GET", "POST", "PUT", "DELETE"], // Разрешенные методы
		allowedHeaders: ["Content-Type", "Authorization"], // Разрешенные заголовки
	}),
);

// 27017
mongoose
	.connect(`mongodb://localhost:27017/KM-DB`)
	.then(() => console.log(`Сервер запущен (Монго ДБ)`))
	.catch(() => console.log(`Ошибка при подключение МонгоДБ`));

// file-dir
const fileDir = path.dirname(fileURLToPath(import.meta.url));
const uAvatarFileFolder = path.join(fileDir, "users-avatar");
if (!existsSync(uAvatarFileFolder)) {
	mkdirSync(uAvatarFileFolder);
}

// file-functions
const uAvatarFunc = multer({
	storage: multer.diskStorage({
		destination: uAvatarFileFolder,
		filename: (_, file, cb) => cb(null, `km-${file.originalname}`),
	}),
	limits: {
		fileSize: 2 * 1024 * 1024,
	},
	fileFilter: (_, file, cb) => {
		if (!["image/jpg", "image/jpeg", "image/png"].includes(file.mimetype)) {
			cb(new Error(`Ошибка формата`), false);
		} else {
			cb(null, true);
		}
	},
});

// MongoDB
const userScheme = new mongoose.Schema({
	username: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	file: { type: String, required: true },
});

const userModel = mongoose.model("user", userScheme);

// Requests
/**
 * Regme-регистрация
 */
app.post(`/regme`, async (req, res) => {
	const { username, email, password } = req.body;
	if ([username, email, password].includes(undefined)) {
		return res.status(400).json({ message: "Отсутсвуют объязательнные поля" });
	} else if (await userModel.findOne({ email })) {
		return res.status(400).json({ message: "Такой email уже существует" });
	} else {
		await userModel.create({ username, email, password });
	}
});

// uAvatar
app.post("/crmfile", uAvatarFunc.single("uavatar"), async (req, res) => {
	const { email } = req.body;
	if (!email || !req.file) {
		return res.status(400).json({ message: "Ошибка файла" });
	} else if (await userModel.findOne({ email })) {
		const filePath = req.file.path;
		await userModel.findOneAndUpdate({ email }, { file: filePath });
		await userModel.findOneAndDelete({ email });
	}
});

// server-run
const PORT = 3000 || 4000;
app.listen(PORT, () => {
	try {
		console.log(`Сервер запущен на порту ${PORT}`);
	} catch (error) {
		console.log(`Ошибка при app.listen`);
	}
});
