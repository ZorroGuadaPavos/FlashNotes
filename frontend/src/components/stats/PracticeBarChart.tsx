import { Box, Heading } from "@chakra-ui/react";
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

interface PracticeData {
	session: string;
	correct: number;
	incorrect: number;
	date: string;
	successRate: number;
}

// Generate mock data for recent practice sessions
const generatePracticeData = (): PracticeData[] => {
	const data: PracticeData[] = [];
	for (let i = 1; i <= 6; i++) {
		const correct = Math.floor(Math.random() * 10 + 5);
		const incorrect = Math.floor(Math.random() * 5 + 1);
		const totalCards = correct + incorrect;

		data.push({
			session: `#${i}`,
			correct,
			incorrect,
			date: new Date(
				Date.now() - (6 - i) * 24 * 60 * 60 * 1000,
			).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
			successRate: Math.round((correct / totalCards) * 100),
		});
	}
	return data;
};

interface PracticeBarChartProps {
	data?: PracticeData[];
	title?: string;
}

const PracticeBarChart = ({
	data = generatePracticeData(),
	title,
}: PracticeBarChartProps) => {
	const { t } = useTranslation();

	return (
		<Box p={6} borderWidth="1px" borderRadius="lg" bg="bg.50" h="100%">
			<Heading size="md" mb={4}>
				{title || t("components.stats.recentPracticeSessions")}
			</Heading>
			<Box h="300px">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={data}
						margin={{
							top: 20,
							right: 30,
							left: 20,
							bottom: 30,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
						<XAxis
							dataKey="session"
							tick={{ fill: "#718096" }}
							tickFormatter={(value, index) => data[index].date}
						/>
						<YAxis tick={{ fill: "#718096" }} />
						<Tooltip
							formatter={(value, name) => [
								value,
								name === "correct"
									? t("components.stats.correctAnswers")
									: t("components.stats.incorrectAnswers"),
							]}
							labelFormatter={(value, payload) => {
								if (payload && payload.length > 0) {
									const index = payload[0].payload;
									const session = data.find((d) => d.session === value);
									return `${t("components.stats.session")} ${value} - ${session?.date || ""}`;
								}
								return value;
							}}
							contentStyle={{
								backgroundColor: "rgba(255, 255, 255, 0.95)",
								borderRadius: "8px",
								boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
								border: "1px solid #e2e8f0",
							}}
						/>
						<Legend
							formatter={(value) => {
								return value === "correct"
									? t("components.stats.correctAnswers")
									: t("components.stats.incorrectAnswers");
							}}
						/>
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
