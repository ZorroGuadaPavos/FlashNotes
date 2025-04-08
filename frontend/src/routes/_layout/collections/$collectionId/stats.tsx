import { FlashcardsService } from "@/client";
import ErrorState from "@/components/commonUI/ErrorState";
import LoadingState from "@/components/commonUI/LoadingState";
import MasteryDonutChart from "@/components/stats/MasteryDonutChart";
import MostFailedCards from "@/components/stats/MostFailedCards";
import PerformanceChart from "@/components/stats/PerformanceChart";
import PracticeBarChart from "@/components/stats/PracticeBarChart";
import {
	Box,
	Container,
	Flex,
	Heading,
	SimpleGrid,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute(
	"/_layout/collections/$collectionId/stats",
)({
	component: StatsPage,
});

function StatsPage() {
	const { t } = useTranslation();
	const { collectionId } = Route.useParams();

	const {
		data: collection,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["collection", collectionId],
		queryFn: () => FlashcardsService.readCollection({ collectionId }),
	});

	if (isLoading) return <LoadingState />;
	if (error) return <ErrorState error={error} />;
	if (!collection)
		return (
			<ErrorState error={new Error(t("general.errors.collectionNotFound"))} />
		);

	// Mock statistics for the dashboard
	const mockStats = {
		totalCards: collection.cards?.length || 0,
		practiceSessions: 12,
		totalCardsPracticed: 78,
		successRate: 68,
		studyStreak: 4,
		cardsStudiedToday: 23,
	};

	return (
		<Container maxW="container.xl" py={6}>
			<Stack gap={6}>
				<Heading>
					{collection.name} - {t("general.words.statistics")}
				</Heading>

				{/* Summary Stats Cards */}
				<SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
					<StatCard
						label={t("general.words.totalCards")}
						value={mockStats.totalCards}
					/>
					<StatCard
						label={t("components.stats.practiceSessions")}
						value={mockStats.practiceSessions}
					/>
					<StatCard
						label={t("components.stats.successRate")}
						value={`${mockStats.successRate}%`}
						helpText={t("components.stats.correctAnswers")}
					/>
					<StatCard
						label={t("components.stats.studyStreak")}
						value={mockStats.studyStreak}
						helpText={t("components.stats.days")}
					/>
				</SimpleGrid>

				{/* Charts - First Row */}
				<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
					<PracticeBarChart />
					<PerformanceChart />
				</SimpleGrid>

				{/* Charts - Second Row */}
				<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
					<MasteryDonutChart />
					<MostFailedCards />
				</SimpleGrid>
			</Stack>
		</Container>
	);
}

// Helper component for stat cards
interface StatCardProps {
	label: string;
	value: string | number;
	helpText?: string;
}

const StatCard = ({ label, value, helpText }: StatCardProps) => {
	return (
		<Box p={4} borderWidth="1px" borderRadius="lg" bg="bg.50">
			<Text fontSize="sm" color="gray.500" mb={1}>
				{label}
			</Text>
			<Text fontSize="2xl" fontWeight="bold">
				{value}
			</Text>
			{helpText && (
				<Text fontSize="xs" color="gray.500" mt={1}>
					{helpText}
				</Text>
			)}
		</Box>
	);
};
