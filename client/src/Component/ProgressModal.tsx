import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCheckCircle,
	faTimes,
	faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./SCSS/ProgressModal.scss";
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
		<div className="progress-modal-overlay">
			<div className="progress-modal-content">
				<button className="close-button" onClick={onClose}>
					<FontAwesomeIcon icon={faTimes} className="close-icon" />
				</button>

				<div className="progress-stages">
					{parsedProgress &&
						parsedProgress.map((parsedStage, index) => {
							return (
								<div
									key={index}
									className={`progress-stage completed`}
									onClick={() => handleStageClick(index)}
								>
									{parsedStage.label}
									<FontAwesomeIcon
										icon={faCheckCircle}
										className="check-icon"
									/>
								</div>
							);
						})}
					<div
						className={`progress-stage`}
						onClick={() =>
							toast.info("This progress has not been reached.")
						}
					>
						COMPLETE
					</div>
				</div>
				<hr />
				{selectedStage !== null && (
					<div
						style={{
							fontSize: "14px",
							marginBottom: "10px",
							color: "white",
							fontWeight: "bold",
						}}
					>
						DETAILS
					</div>
				)}
				{selectedStage !== null && (
					<div className="stage-details">
						<p>
							{parsedProgress
								? parsedProgress[selectedStage].details
								: "Progress is null."}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
