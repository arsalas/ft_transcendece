import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
	BACKEND_PORT: Joi.number().default(3000),
	BBDD_PORT: Joi.required(),
	POSTGRES_DB: Joi.required(),
	POSTGRES_USER: Joi.required(),
	POSTGRES_PASSWORD: Joi.required(),
	CLIENT_ID: Joi.required(),
	CLIENT_SECRET: Joi.required(),
	JWT_SECRET: Joi.required(),
	WEB_URL: Joi.string().default('http://localhost:3000'),
});
