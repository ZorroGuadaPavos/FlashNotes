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

interface PerformanceData {
	day: string;
	correctRate: number;
	cardsReviewed: number;
}

// Mock data for performance chart
const generatePerformanceData = (): PerformanceData[] => {
	const dates = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	return dates.map((day) => ({
		day,
		correctRate: Math.floor(55 + Math.random() * 30),
		cardsReviewed: Math.floor(10 + Math.random() * 25),
	}));
};

interface PerformanceChartProps {
	data?: PerformanceData[];
	title?: string;
}

const PerformanceChart = ({
	data = generatePerformanceData(),
	title,
}: PerformanceChartProps) => {
	const { t } = useTranslation();

	return (
		<Box p={6} borderWidth="1px" borderRadius="lg" bg="bg.50" h="100%">
			<Heading size="md" mb={4}>
				{title || t("components.stats.performanceOverTime")}
			</Heading>
			<Box h="300px">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart
						data={data}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
						<XAxis dataKey="day" tick={{ fill: "#718096" }} />
						<YAxis
							yAxisId="left"
							tick={{ fill: "#718096" }}
							domain={[0, 100]}
						/>
						<YAxis
							yAxisId="right"
							orientation="right"
							tick={{ fill: "#718096" }}
						/>
						<Tooltip
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
							dataKey="cardsReviewed"
							stroke="#4299E1"
							strokeWidth={2}
							dot={{ strokeWidth: 2, r: 4, fill: "#4299E1" }}
							name={t("components.stats.cardsReviewed")}
						/>
					</LineChart>
				</ResponsiveContainer>
			</Box>
		</Box>
	);
};

export default PerformanceChart;
