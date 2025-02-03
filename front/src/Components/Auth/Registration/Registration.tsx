import { useForm, SubmitHandler } from "react-hook-form";
import { TRegScheme, useAuth } from "../../Hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../queryClient";
import React from "react";
// import { useNavigate } from "react-router";
// аа
const Registration: React.FC = () => {
	// React-Hook-form
	const {
		register,
		getValues,
		formState: { errors },
		handleSubmit,
	} = useForm<TRegScheme>();

	// Tanstack-React-Query
	const { regMe } = useAuth();

	const getValue: TRegScheme = getValues();
	const regMutation = useMutation({
		mutationFn: () => regMe(getValue),
		onError: () => console.log(`Ошибка в regMutation`),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["regme"] }),
	});

	const onSubmit: SubmitHandler<TRegScheme> = (data) => {
		console.log(`Data`, data);
		regMutation.mutateAsync();
	};

	// Navigate
	// const navigate = useNavigate();

	// FileManager
	return (
		<div className="registration registration__content">
			<form onSubmit={handleSubmit(onSubmit)} className="registration__form">
				<input
					{...register("username", {
						required: "Username is required",
						minLength: { value: 2, message: "Минимум 2 символа" },
					})}
					name="username"
					type="text"
					className="registration__input registration__input--text"
					placeholder="Введите username"
				/>
				{errors.username && <span>{errors.username.message}</span>}{" "}
				{/* Вывод ошибки для username */}
				<input
					{...register("email", {
						required: "Email is required",
						minLength: { value: 2, message: "Минимум 2 символа" },
					})}
					name="email"
					type="email"
					className="registration__input registration__input--text"
					placeholder="Введите email"
				/>
				{errors.email && <span>{errors.email.message}</span>}{" "}
				{/* Вывод ошибки для email */}
				<input
					{...register("password", {
						required: "Password is required",
						minLength: { value: 2, message: "Минимум 2 символа" },
					})}
					name="password"
					type="password"
					className="registration__input registration__input--text"
					placeholder="Введите пароль"
				/>
				{errors.password && <span>{errors.password.message}</span>}{" "}
				<button type="submit" className="btn registration__btn">
					Зарегистрироваться
				</button>
			</form>
			<form action="">
				<input type="file" name="uavatar" id="uavatar" />
				<button type="submit">Отправить файл</button>
			</form>
		</div>
	);
};

export default Registration;
