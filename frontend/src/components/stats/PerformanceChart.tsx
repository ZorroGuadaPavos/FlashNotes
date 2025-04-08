import { Box, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import type { PracticeSessionStats } from "@/client";

interface PerformanceData {
	label: string;
	correctRate: number;
	cardsPracticed: number;
}

interface PerformanceChartProps {
	sessions?: PracticeSessionStats[];
	title?: string;
}

const PerformanceChart = ({ sessions, title }: PerformanceChartProps) => {
	const { t } = useTranslation();

	const chartData: PerformanceData[] = (
		sessions?.map((session, index) => {
			const correctRate =
				session.cards_practiced > 0
					? Math.round(
							(session.correct_answers / session.cards_practiced) * 100,
						)
					: 0;
			const dateStr = new Date(session.created_at).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			});
			return {
				label: `#${index + 1} (${dateStr})`,
				correctRate,
				cardsPracticed: session.cards_practiced,
			};
		}) || []
	).reverse();

	return (
		<Box p={6} borderWidth="1px" borderRadius="lg" bg="bg.50" h="100%">
			<Heading size="md" mb={4}>
				{title || t("components.stats.performanceOverTime")}
			</Heading>
			<Box h="300px">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart
						data={chartData}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
						<XAxis
							dataKey="label"
							tick={{ fill: "#718096", fontSize: 12 }}
							tickFormatter={(value) => value.split(" ")[0]}
						/>
						<YAxis
							yAxisId="left"
							tick={{ fill: "#718096" }}
							domain={[0, 100]}
						/>
						<YAxis
							yAxisId="right"
							orientation="right"
							tick={{ fill: "#718096" }}
							allowDecimals={false}
						/>
						<Tooltip
							formatter={(value, name) => {
								if (name === "correctRate") {
									return [`${value}%`, t("components.stats.correctRate")];
								}
								if (name === "cardsPracticed") {
									return [value, t("components.stats.cardsPracticed")];
								}
								return [value, name];
							}}
							labelFormatter={(label) => label}
							contentStyle={{
								backgroundColor: "rgba(255, 255, 255, 0.95)",
								borderRadius: "8px",
								boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
								border: "1px solid #e2e8f0",
							}}
						/>
						<Legend />
						<Line
							yAxisId="left"
							type="monotone"
							dataKey="correctRate"
							stroke="#38B2AC"
							strokeWidth={3}
							dot={{ strokeWidth: 2, r: 4, fill: "#38B2AC" }}
							activeDot={{ r: 8, fill: "#38B2AC" }}
							name={t("components.stats.correctRate")}
						/>
						<Line
							yAxisId="right"
							type="monotone"
							dataKey="cardsPracticed"
							stroke="#4299E1"
							strokeWidth={2}
							dot={{ strokeWidth: 2, r: 4, fill: "#4299E1" }}
							name={t("components.stats.cardsPracticed")}
						/>
					</LineChart>
				</ResponsiveContainer>
			</Box>
		</Box>
	);
};

export default PerformanceChart;
