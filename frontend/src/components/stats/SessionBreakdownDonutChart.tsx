import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";

interface SessionDataPoint {
	name: string;
	value: number;
	color: string;
}

interface LegendFormatterEntry {
	value: string;
	color?: string;

	payload?: {
		[key: string]: unknown;
	};
}

interface SessionBreakdownDonutChartProps {
	sessionData?: SessionDataPoint[];
	totalValue?: number;
	title?: string;
}

const SessionBreakdownDonutChart = ({
	sessionData = [],
	totalValue = 0,
	title,
}: SessionBreakdownDonutChartProps) => {
	const { t } = useTranslation();

	if (!sessionData || sessionData.length === 0) {
		return (
			<Box p={6} borderWidth="1px" borderRadius="lg" bg="bg.50" h="100%">
				<Heading size="md" mb={4}>
					{title || t("components.stats.latestSessionBreakdown")}
				</Heading>
				<Flex align="center" justify="center" h="300px">
					<Text color="gray.500">{t("components.stats.noDataAvailable")}</Text>
				</Flex>
			</Box>
		);
	}

	return (
		<Box p={6} borderWidth="1px" borderRadius="lg" bg="bg.50" h="100%">
			<Heading size="md" mb={4}>
				{title || t("components.stats.latestSessionBreakdown")}
			</Heading>
			<Flex direction="column" align="center" h="300px">
				<ResponsiveContainer width="100%" height="85%">
					<PieChart>
						<Pie
							data={sessionData}
							dataKey="value"
							cx="50%"
							cy="50%"
							innerRadius="60%"
							outerRadius="85%"
							paddingAngle={2}
							labelLine={false}
							label={({
								cx,
								cy,
								midAngle,
								innerRadius,
								outerRadius,
								percent,
							}: {
								cx: number;
								cy: number;
								midAngle: number;
								innerRadius: number;
								outerRadius: number;
								percent: number;
							}) => {
								const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
								const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
								const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

								return percent > 0.05 ? (
									<text
										x={x}
										y={y}
										fill="#fff"
										textAnchor="middle"
										dominantBaseline="central"
										fontSize={14}
										fontWeight="bold"
									>
										{`${(percent * 100).toFixed(0)}%`}
									</text>
								) : null;
							}}
						>
							{sessionData.map((entry: SessionDataPoint) => (
								<Cell
									key={`cell-${entry.name}`}
									fill={entry.color}
									stroke="none"
								/>
							))}
						</Pie>
						<Tooltip
							formatter={(value, name) => [`${value} cards`, name]}
							contentStyle={{
								backgroundColor: "rgba(255, 255, 255, 0.95)",
								borderRadius: "8px",
								boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
								border: "1px solid #e2e8f0",
							}}
						/>
						<Legend
							verticalAlign="bottom"
							height={36}
							formatter={(value: string, entry: LegendFormatterEntry) => {
								const color = entry.color;
								return (
									<span style={{ color: color || "#000", fontWeight: 500 }}>
										{value}
									</span>
								);
							}}
						/>
					</PieChart>
				</ResponsiveContainer>
				<Text fontWeight="bold" fontSize="xl" mt={-4}>
					{totalValue} {t("general.words.cards")}
				</Text>
			</Flex>
		</Box>
	);
};

export default SessionBreakdownDonutChart;
