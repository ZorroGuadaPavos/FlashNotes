import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface FailedCardData {
	id: string;
	title: string;
	failRate: number;
	totalAttempts: number;
}

// Generate mock data for most failed cards
const generateMostFailedCardsData = (): FailedCardData[] => {
	const mockTitles = [
		"What is the capital of France?",
		"Define object-oriented programming",
		"List the first 5 elements of the periodic table",
		"What year did World War II end?",
		"Explain the difference between HTTP and HTTPS",
		"What is the formula for calculating area of a circle?",
		"Name three works by Shakespeare",
		"What is the function of mitochondria in cells?",
	];

	return mockTitles
		.map((title, index) => ({
			id: `card-${index}`,
			title: title,
			failRate: Math.round(40 + Math.random() * 40), // 40-80% fail rate
			totalAttempts: Math.floor(5 + Math.random() * 15), // 5-20 attempts
		}))
		.sort((a, b) => b.failRate - a.failRate)
		.slice(0, 6); // Take top 6 most failed cards
};

interface MostFailedCardsProps {
	data?: FailedCardData[];
	title?: string;
}

const MostFailedCards = ({
	data = generateMostFailedCardsData(),
	title,
}: MostFailedCardsProps) => {
	const { t } = useTranslation();

	return (
		<Box p={6} borderWidth="1px" borderRadius="lg" bg="bg.50" h="100%">
			<Heading size="md" mb={4}>
				{title || t("components.stats.mostFailedCards")}
			</Heading>

			<Stack gap={4} align="stretch">
				{data.map((card) => (
					<Box key={card.id}>
						<Flex justify="space-between" mb={1}>
							<Text
								fontWeight="medium"
								overflow="hidden"
								textOverflow="ellipsis"
								whiteSpace="nowrap"
								title={card.title}
							>
								{card.title}
							</Text>
							<Text fontWeight="bold" color="red.500">
								{card.failRate}%
							</Text>
						</Flex>
						<Flex justify="space-between" mb={1}>
							<Box
								w="100%"
								h="8px"
								borderRadius="full"
								bg="red.100"
								position="relative"
								overflow="hidden"
							>
								<Box
									position="absolute"
									left={0}
									top={0}
									h="100%"
									w={`${card.failRate}%`}
									bg="red.500"
									borderRadius="full"
								/>
							</Box>
						</Flex>
						<Text fontSize="xs" color="gray.500">
							{t("components.stats.failedOutOfAttempts", {
								failed: Math.round((card.totalAttempts * card.failRate) / 100),
								total: card.totalAttempts,
							})}
						</Text>
						<Box h="2" />
					</Box>
				))}
			</Stack>

			<Text fontSize="sm" mt={4} color="gray.500" textAlign="center">
				{t("components.stats.practiceTheseCards")}
			</Text>
		</Box>
	);
};

export default MostFailedCards;
