
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import cv, { Mat, } from "@/opencv";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// 処理はここから始まる
document.addEventListener("DOMContentLoaded", async (event: Event): Promise<void> => {
	const divRoot: HTMLDivElement = document.getElementById("root") as HTMLDivElement;

	// ローディング開始
	const divMessage: HTMLDivElement = document.createElement("div");
	divMessage.innerHTML = "loading";
	divRoot.appendChild(divMessage);

	// カメラデバイス取得
	const stream: MediaStream = await window.navigator.mediaDevices.getUserMedia({
		video: { facingMode: "environment" },
		audio: false,
	});

	// ビデオ設定
	const track: MediaStreamTrack = stream.getVideoTracks()[0];
	const setting: MediaTrackSettings = track.getSettings();
	const settingWidth: number = setting.width || 100 ;
	const settingHeight: number = setting.height || 100;
	const video: HTMLVideoElement = document.createElement("video");
	divRoot.appendChild(video);
	video.width = Math.floor(100 * (settingWidth < settingHeight ? 1 : settingWidth / settingHeight));
	video.height = Math.floor(100 * (settingHeight < settingWidth ? 1 : settingHeight / settingWidth));
	video.srcObject = stream;
	video.play();

	// 画像処理キャンバス作成
	const canvasDraw: HTMLCanvasElement = document.createElement("canvas");
	canvasDraw.width = 256;
	canvasDraw.height = 256;
	const context: CanvasRenderingContext2D = canvasDraw.getContext("2d") as CanvasRenderingContext2D;
	// 表示キャンバス作成
	const canvasView: HTMLCanvasElement = document.createElement("canvas");
	divRoot.appendChild(canvasView);

	// opencvの読込待機
	await new Promise((resolve: Function): void => { cv.then(() => resolve()); });
	divMessage.innerHTML = "start";

	// メインループ
	const mainloop: FrameRequestCallback = (time: number): void => {
		// カメラから画像を抽出
		const aspectRatioVideo: number = video.videoWidth / video.videoHeight;
		const aspectRatioCanvas: number = canvasDraw.width / canvasDraw.height;
		const srcw: number = Math.floor(aspectRatioVideo < aspectRatioCanvas ? video.videoWidth : video.videoHeight * canvasDraw.width / canvasDraw.height);
		const srch: number = Math.floor(aspectRatioVideo > aspectRatioCanvas ? video.videoHeight : video.videoWidth * canvasDraw.height / canvasDraw.width);
		const srcx: number = Math.floor((video.videoWidth - srcw) / 2);
		const srcy: number = Math.floor((video.videoHeight - srch) / 2);
		context.drawImage(video, srcx, srcy, srcw, srch, 0, 0, canvasDraw.width, canvasDraw.height);

		const src: Mat = cv.imread(canvasDraw);
		const matGray: Mat = new cv.Mat();

		// 白黒変換
		cv.cvtColor(src, matGray, cv.COLOR_RGBA2GRAY, 0);

		// 描画
		cv.imshow(canvasView, matGray);

		src.delete();
		matGray.delete();

		window.requestAnimationFrame(mainloop);
	};

	// メインループ開始
	window.requestAnimationFrame(mainloop);
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

