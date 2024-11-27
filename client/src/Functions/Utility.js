export default class Utility {
	static getFileExtension = (url) => {
		const regex = /(?:\.([^.]+))?$/;
		const match = url.match(regex);
		return match ? match[1] : "";
	};

	static isImage = (extension) => {
		const imageExtensions = ["jpg", "jpeg", "png", "gif"];
		return imageExtensions.includes(extension.toLowerCase());
	};

	static isApplicationPDF = (extension) => {
		return extension.toLowerCase() === "pdf";
	};
}
