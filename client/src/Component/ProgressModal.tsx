import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCheckCircle,
	faTimes,
	faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

interface Progress {
	label: string;
	details: string;
}
interface ProgressModalProps {
	currentStage: number;
	progress: Progress[] | null;
	onClose: () => void;
}
export default function ProgressModal({
	currentStage,
	progress = null,
	onClose,
}: ProgressModalProps) {
	const [selectedStage, setSelectedStage] = useState(null);
	const [parsedProgress, setParsedProgress] = useState<Progress[] | null>(
		null
	);
	const handleStageClick = (index) => {
		setSelectedStage(index === selectedStage ? null : index);
	};

	useEffect(() => {
		if (progress) {
			setParsedProgress(
				progress?.map((stage) =>
					typeof stage === "string" ? JSON.parse(stage) : stage
				)
			);
		}
	}, [progress]);

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

				<div className="progress-stages space-y-4">
					{parsedProgress &&
						parsedProgress.map((parsedStage, index) => (
							<div
								key={index}
								className={`progress-stage flex items-center justify-between px-6 py-4 rounded-lg transition-colors ${
									parsedStage.completed
										? "bg-green-500 text-white"
										: "bg-green-50 text-green-700"
								} cursor-pointer hover:bg-green-100`}
								onClick={() => handleStageClick(index)}
							>
								<span className="font-medium">
									{parsedStage.label}
								</span>
								{parsedStage.completed && (
									<FontAwesomeIcon
										icon={faCheckCircle}
										className="check-icon text-white"
									/>
								)}
							</div>
						))}

					{/* <div
						className="progress-stage cursor-pointer py-4 px-6 rounded-lg bg-green-50 text-green-700 mt-4 text-center"
						onClick={() =>
							toast.info("This progress has not been reached.")
						}
					>
						<span className="font-medium">COMPLETE</span>
					</div> */}
				</div>

				<hr className="border-gray-200" />

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
