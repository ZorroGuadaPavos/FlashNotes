import { BlueButton, DefaultButton } from "@/components/commonUI/Button";
import { Footer } from "@/components/commonUI/Footer";
import {
	Center,
	Container,
	Heading,
	Image,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { isLoggedIn } from "../hooks/useAuth";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	const isAuthenticated = isLoggedIn();

	return (
		<Center minH="100vh">
			<Container maxW="container.xl" py={20}>
				<Stack
					direction={{ base: "column", lg: "row" }}
					gap={10}
					align="center"
					justify="center"
				>
					<VStack gap={8} align={{ base: "center", lg: "flex-start" }} flex={1}>
						<Image src="/favicon.svg" alt="FlashNotes favicon" w="100px" />
						<Heading
							as="h1"
							size="2xl"
							fontWeight="bold"
							textAlign={{ base: "center", lg: "left" }}
						>
							Learn Better with FlashNotes
						</Heading>
						<Text
							fontSize="xl"
							color="gray.500"
							textAlign={{ base: "center", lg: "left" }}
						>
							A simple flashcard app that helps you learn. Create cards,
							practice regularly, and remember what matters.
						</Text>
						<Stack direction="row" gap={4}>
							{isAuthenticated ? (
								<Link to="/collections">
									<BlueButton size="lg">Let's Study!</BlueButton>
								</Link>
							) : (
								<>
									<Link to="/signup">
										<DefaultButton size="lg">Get Started</DefaultButton>
									</Link>
									<Link to="/login">
										<DefaultButton size="lg">Log In</DefaultButton>
									</Link>
								</>
							)}
						</Stack>
					</VStack>

					<VStack flex={1} gap={8}>
						<video
							src="/preview.mp4"
							autoPlay
							loop
							muted
							style={{
								width: "100%",
								maxWidth: "18rem",
								borderRadius: "12px",
								border: "1px solid #565158",
								boxShadow:
									" 0px 2px 4px color-mix(in srgb, black 64%, transparent), 0px 0px 1px inset color-mix(in srgb, #d4d4d8 30%, transparent)",
							}}
						/>
					</VStack>
				</Stack>

				<VStack gap={16} mt={20}>
					<Heading as="h2" size="xl" textAlign="center">
						Features
					</Heading>
					<Stack
						direction={{ base: "column", md: "row" }}
						gap={8}
						align="stretch"
					>
						<Feature
							title="Simple Design"
							description="A clean interface that helps you focus on learning."
						/>
						<Feature
							title="AI Generation"
							description="Create flashcards automatically with AI to save time and enhance learning."
						/>
						<Feature
							title="Responsive Design"
							description="Study anywhere on any device with a fully responsive interface."
						/>
					</Stack>
				</VStack>
				<Footer version="0.0.16" />
			</Container>
		</Center>
	);
}

function Feature({
	title,
	description,
}: { title: string; description: string }) {
	return (
		<VStack
			p={8}
			bg="bg.box"
			borderRadius="lg"
			gap={4}
			flex={1}
			align="flex-start"
			borderWidth="1px"
			borderColor="bg.100"
		>
			<Heading as="h3" size="md">
				{title}
			</Heading>
			<Text color="gray.500">{description}</Text>
		</VStack>
	);
}
