import { FlashcardsService } from "@/client";
import { StatsService } from "@/client";
import ErrorState from "@/components/commonUI/ErrorState";
import LoadingState from "@/components/commonUI/LoadingState";
import MasteryDonutChart from "@/components/stats/MasteryDonutChart";
import MostFailedCards from "@/components/stats/MostFailedCards";
import PerformanceChart from "@/components/stats/PerformanceChart";
import PracticeBarChart from "@/components/stats/PracticeBarChart";
import {
	Box,
	Container,
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
		data: stats,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["collectionStats", collectionId],
		queryFn: () =>
			StatsService.getCollectionStatisticsEndpoint({ collectionId }),
	});

	const { data: collection } = useQuery({
		queryKey: ["collection", collectionId],
		queryFn: () => FlashcardsService.readCollection({ collectionId }),
		enabled: !!collectionId,
	});

	if (isLoading) return <LoadingState />;
	if (error) return <ErrorState error={error} />;
	if (!stats)
		return (
			<ErrorState error={new Error(t("general.errors.collectionNotFound"))} />
		);

	const latestSession =
		stats.recent_sessions && stats.recent_sessions.length > 0
			? stats.recent_sessions[0]
			: null;
	const successRate =
		latestSession && latestSession.cards_practiced > 0
			? Math.round(
					(latestSession.correct_answers / latestSession.cards_practiced) * 100,
				)
			: null;

	interface SessionBreakdownDataPoint {
		name: string;
		value: number;
		color: string;
	}

	let sessionBreakdownData: SessionBreakdownDataPoint[] = [];
	if (latestSession && stats.collection_info.total_cards > 0) {
		const totalCollectionCards = stats.collection_info.total_cards;
		const correctCount = latestSession.correct_answers;
		const incorrectCount =
			latestSession.cards_practiced - latestSession.correct_answers;

		const notPracticedCount = Math.max(
			0,
			totalCollectionCards - latestSession.cards_practiced,
		);

		sessionBreakdownData = [
			{
				name: t("components.stats.correct"),
				value: correctCount,
				color: "#38A169",
			},
			{
				name: t("components.stats.incorrect"),
				value: incorrectCount,
				color: "#E53E3E",
			},
			{
				name: t("components.stats.notPracticedInSession"),
				value: notPracticedCount,
				color: "#A0AEC0",
			},
		].filter((item) => item.value >= 0);
	} else if (stats.collection_info.total_cards > 0) {
		sessionBreakdownData = [
			{
				name: t("components.stats.notPracticedYet"),
				value: stats.collection_info.total_cards,
				color: "#A0AEC0",
			},
		];
	}

	const totalCardsForDonut = stats.collection_info.total_cards;

	return (
		<Container maxW="container.xl" py={6}>
			<Stack gap={6}>
				<Heading>
					{collection?.name || "Collection"} - {t("general.words.statistics")}
				</Heading>

				<SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
					<StatCard
						label={t("general.words.totalCards")}
						value={stats.collection_info.total_cards}
					/>
					<StatCard
						label={t("components.stats.practiceSessions")}
						value={stats.collection_info.total_practice_sessions}
					/>
					<StatCard
						label={t("components.stats.successRate")}
						value={successRate !== null ? `${successRate}%` : "-"}
						helpText={
							successRate !== null
								? t("components.stats.lastSession")
								: t("components.stats.noRecentSessions")
						}
					/>
					<StatCard
						label={t("components.stats.studyStreak")}
						value={"-"}
						helpText={t("components.stats.days")}
					/>
				</SimpleGrid>

				<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
					<PracticeBarChart sessions={stats.recent_sessions} />
					<PerformanceChart sessions={stats.recent_sessions} />
				</SimpleGrid>

				<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
					<MasteryDonutChart
						sessionData={sessionBreakdownData}
						totalValue={totalCardsForDonut}
						title={t("components.stats.latestSessionBreakdown")}
					/>
					<MostFailedCards cards={stats.difficult_cards} />
				</SimpleGrid>
			</Stack>
		</Container>
	);
}

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
