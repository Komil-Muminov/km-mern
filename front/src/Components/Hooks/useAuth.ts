export interface TRegScheme {
	username: string;
	email: string;
	password: string;
}

export const useAuth = () => {
	const regMe = async (data: TRegScheme): Promise<Response> => {
		return await fetch(`https://km-node-back.vercel.app/regme`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}).then((res: Response) => {
			if (!res.ok) {
				throw new Error();
			} else {
				return res;
			}
		});
	};
	return {
		regMe,
	};
};
