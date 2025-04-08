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

interface MasteryData {
	name: string;
	value: number;
	color: string;
}

// Mock data for mastery levels
const generateMasteryData = (): MasteryData[] => {
	return [
		{
			name: "Mastered",
			value: Math.floor(20 + Math.random() * 30),
			color: "#38A169",
		},
		{
			name: "Learning",
			value: Math.floor(30 + Math.random() * 30),
			color: "#4299E1",
		},
		{
			name: "Not Started",
			value: Math.floor(10 + Math.random() * 20),
			color: "#E53E3E",
		},
	];
};

interface MasteryDonutChartProps {
	data?: MasteryData[];
	title?: string;
}

const MasteryDonutChart = ({
	data = generateMasteryData(),
	title,
}: MasteryDonutChartProps) => {
	const { t } = useTranslation();
	const total = data.reduce((sum, item) => sum + item.value, 0);

	return (
		<Box p={6} borderWidth="1px" borderRadius="lg" bg="bg.50" h="100%">
			<Heading size="md" mb={4}>
				{title || t("components.stats.masteryDistribution")}
			</Heading>
			<Flex direction="column" align="center" h="300px">
				<ResponsiveContainer width="100%" height="85%">
					<PieChart>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							innerRadius="60%"
							outerRadius="85%"
							paddingAngle={2}
							dataKey="value"
							labelLine={false}
							label={({
								cx,
								cy,
								midAngle,
								innerRadius,
								outerRadius,
								percent,
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
							{data.map((entry) => (
								<Cell
									key={`cell-${entry.name}`}
									fill={entry.color}
									stroke="none"
								/>
							))}
						</Pie>
						<Tooltip
							formatter={(value) => [`${value} cards`, "Amount"]}
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
							formatter={(value, entry, index) => {
								const item = data.find((d) => d.name === value);
								return (
									<span
										style={{ color: item?.color || "#000", fontWeight: 500 }}
									>
										{value}
									</span>
								);
							}}
						/>
					</PieChart>
				</ResponsiveContainer>
				<Text fontWeight="bold" fontSize="xl" mt={-4}>
					{total} {t("general.words.cards")}
				</Text>
			</Flex>
		</Box>
	);
};

export default MasteryDonutChart;
