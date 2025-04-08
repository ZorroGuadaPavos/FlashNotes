import { Box, Heading, useBreakpointValue } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import type { PracticeSessionStats } from "@/client";

interface PracticeData {
	session: string;
	correct: number;
	incorrect: number;
	date: string;
}

interface PracticeBarChartProps {
	sessions?: PracticeSessionStats[];
	title?: string;
}

const PracticeBarChart = ({ sessions, title }: PracticeBarChartProps) => {
	const { t } = useTranslation();
	const showAxisAndLegend = useBreakpointValue({ base: false, md: true });

	const chartData: PracticeData[] = (
		sessions?.map((session, index) => ({
			session: `#${index + 1}`,
			correct: session.correct_answers,
			incorrect: session.cards_practiced - session.correct_answers,
			date: new Date(session.created_at).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			}),
		})) || []
	).reverse();

	return (
		<Box p={6} borderWidth="1px" borderRadius="lg" bg="bg.50" h="100%">
			<Heading size="md" mb={4}>
				{title || t("components.stats.recentPracticeSessions")}
			</Heading>
			<Box h="300px">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={chartData}
						margin={{
							top: 20,
							right: 30,
							left: 20,
							bottom: 30,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
						{showAxisAndLegend && (
							<XAxis
								dataKey="session"
								tick={{ fill: "#718096" }}
								tickFormatter={(value, index) =>
									chartData[index]?.date || value
								}
							/>
						)}
						{showAxisAndLegend && <YAxis tick={{ fill: "#718096" }} />}
						<Tooltip
							formatter={(value, name) => [
								value,
								name === "correct"
									? t("components.stats.correctAnswers")
									: t("components.stats.incorrectAnswers"),
							]}
							labelFormatter={(label, payload) => {
								if (payload && payload.length > 0) {
									const sessionData = payload[0].payload as PracticeData;

									return `${t("components.stats.session")} ${sessionData.session} - ${sessionData.date}`;
								}
								return label;
							}}
							contentStyle={{
								backgroundColor: "rgba(255, 255, 255, 0.95)",
								borderRadius: "8px",
								boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
								border: "1px solid #e2e8f0",
							}}
						/>
						{showAxisAndLegend && (
							<Legend
								formatter={(value) => {
									return value === "correct"
										? t("components.stats.correctAnswers")
										: t("components.stats.incorrectAnswers");
								}}
							/>
						)}
						<ReferenceLine y={0} stroke="#000" />
						<Bar dataKey="correct" fill="#38A169" radius={[4, 4, 0, 0]} />
						<Bar dataKey="incorrect" fill="#E53E3E" radius={[4, 4, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			</Box>
		</Box>
	);
};

export default PracticeBarChart;
