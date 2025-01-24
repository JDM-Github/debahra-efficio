import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimes } from "@fortawesome/free-solid-svg-icons";

interface Progress {
	label: string;
	details: string;
	complete: boolean;
}

interface ProgressModalProps {
	currentStage: number;
	progress: Progress[] | null;
	onClose: () => void;
}

export default function ProgressModal({
	progress = null,
	onClose,
}: ProgressModalProps) {
	const [selectedStage, setSelectedStage] = useState<number | null>(null);
	const [parsedProgress, setParsedProgress] = useState<Progress[] | null>(
		null
	);

	const handleStageClick = (index: number) => {
		setSelectedStage(index === selectedStage ? null : index);
	};

	useEffect(() => {
		if (progress) {
			setParsedProgress(
				progress.map((stage) =>
					typeof stage === "string" ? JSON.parse(stage) : stage
				)
			);
		}
	}, [progress]);

	const calculateProgress = () => {
		if (!parsedProgress) return 0;
		const completedStages = parsedProgress.filter(
			(stage) => stage.complete === true
		);
		return (completedStages.length / parsedProgress.length) * 100;
	};

	return (
		<div className="progress-modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="progress-modal-content bg-white rounded-lg shadow-xl w-full max-w-lg p-8 space-y-6 border-t-4 border-green-600">
				<button
					className="close-button absolute top-3 right-3 text-2xl text-gray-600 hover:text-gray-900 transition-colors"
					onClick={onClose}
				>
					<FontAwesomeIcon icon={faTimes} />
				</button>

				<h2 className="text-3xl font-semibold text-green-800 text-center mb-6">
					Progress Overview
				</h2>

				<div className="progress-bar bg-gray-200 w-full h-2 rounded-full mb-4">
					<div
						className="progress-bar-fill h-full bg-green-500 rounded-full"
						style={{ width: `${calculateProgress()}%` }}
					></div>
				</div>

				{/* Progress Stages */}
				<div className="progress-stages space-y-4">
					{parsedProgress &&
						parsedProgress.map((parsedStage, index) => (
							<div
								key={index}
								className={`progress-stage flex items-center justify-between px-6 py-4 rounded-lg transition-colors ${
									parsedStage.complete
										? "bg-green-500 text-white"
										: "bg-green-50 text-green-700"
								} cursor-pointer`}
								onClick={() => handleStageClick(index)}
							>
								<span className="font-medium">
									{parsedStage.label}
								</span>
								{parsedStage.complete && (
									<FontAwesomeIcon
										icon={faCheckCircle}
										className="check-icon text-white"
									/>
								)}
							</div>
						))}
				</div>

				<hr className="border-gray-200" />

				{/* Stage Details */}
				{selectedStage !== null && (
					<div className="details-header text-sm font-semibold text-gray-600 mb-2">
						DETAILS
					</div>
				)}

				{selectedStage !== null && (
					<div className="stage-details text-gray-800">
						<p className="text-sm leading-relaxed">
							{parsedProgress
								? parsedProgress[selectedStage].details
								: "No details available."}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
