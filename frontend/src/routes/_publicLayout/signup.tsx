import Logo from "@/assets/Logo.svg";
import {
	Button,
	Container,
	Field,
	Fieldset,
	Image,
	Text,
} from "@chakra-ui/react";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { UserRegister } from "../../client";
import { DefaultInput } from "../../components/commonUI/Input";
import useAuth, { isLoggedIn } from "../../hooks/useAuth";
import { confirmPasswordRules, emailPattern, passwordRules } from "../../utils";

export const Route = createFileRoute("/_publicLayout/signup")({
	component: SignUp,
	beforeLoad: async () => {
		if (isLoggedIn()) {
			throw redirect({
				to: "/",
			});
		}
	},
});

interface UserRegisterForm extends UserRegister {
	confirm_password: string;
}

function SignUp() {
	const { t } = useTranslation();
	const { signUpMutation } = useAuth();
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<UserRegisterForm>({
		mode: "onBlur",
		criteriaMode: "all",
		defaultValues: {
			email: "",
			full_name: "",
			password: "",
			confirm_password: "",
		},
	});

	const onSubmit: SubmitHandler<UserRegisterForm> = (data) => {
		signUpMutation.mutate(data);
	};

	return (
		<Container
			h="100dvh"
			maxW="sm"
			alignItems="stretch"
			justifyContent="center"
			gap={4}
			centerContent
		>
			<Image
				src={Logo}
				alt="Logo"
				height="auto"
				maxW="2xs"
				alignSelf="center"
				mb={4}
			/>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Fieldset.Root maxW="sm">
					<Fieldset.Content>
						<Field.Root>
							<Field.Label>{t("general.words.fullName")}</Field.Label>
							<DefaultInput
								placeholder={t("general.words.fullName")}
								type="text"
								minLength={3}
								{...register("full_name", {
									required: t("general.errors.fullNameIsRequired"),
								})}
							/>
							{errors.full_name && (
								<Text color="red.500" fontSize="sm">
									{errors.full_name.message}
								</Text>
							)}
						</Field.Root>

						<Field.Root>
							<Field.Label>{t("general.words.email")}</Field.Label>
							<DefaultInput
								placeholder={t("general.words.email")}
								type="email"
								{...register("email", {
									required: t("general.errors.emailIsRequired"),
									pattern: emailPattern,
								})}
							/>
							{errors.email && (
								<Text color="red.500" fontSize="sm">
									{errors.email.message}
								</Text>
							)}
						</Field.Root>

						<Field.Root>
							<Field.Label>{t("general.words.password")}</Field.Label>
							<DefaultInput
								placeholder={t("general.words.password")}
								type="password"
								{...register("password", passwordRules())}
							/>
							{errors.password && (
								<Text color="red.500" fontSize="sm">
									{errors.password.message}
								</Text>
							)}
						</Field.Root>

						<Field.Root>
							<Field.Label>{t("general.actions.confirmPassword")}</Field.Label>
							<DefaultInput
								placeholder={t("general.actions.repeatPassword")}
								type="password"
								{...register(
									"confirm_password",
									confirmPasswordRules(getValues),
								)}
							/>
							{errors.confirm_password && (
								<Text color="red.500" fontSize="sm">
									{errors.confirm_password.message}
								</Text>
							)}
						</Field.Root>
					</Fieldset.Content>
					<Button type="submit" loading={isSubmitting}>
						{t("general.actions.signUp")}
					</Button>
				</Fieldset.Root>
			</form>
			<Text>
				{t("routes.publicLayout.signUp.alreadyHaveAccount")}{" "}
				<Link to="/login">
					<Text as="span" color="blue.500">
						{t("general.actions.login")}!
					</Text>
				</Link>
			</Text>
		</Container>
	);
}

export default SignUp;
