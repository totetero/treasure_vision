
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// 処理はここから始まる
document.addEventListener("DOMContentLoaded", async event => {
	const divRoot = document.getElementById("root");

	// ローディング開始
	const divMessage = document.createElement("div");
	divMessage.innerHTML = "loading";
	divRoot.appendChild(divMessage);

	// カメラデバイス取得
	const stream = await window.navigator.mediaDevices.getUserMedia({
		video: { facingMode: "environment" },
		audio: false,
	});

	// ビデオ設定
	const track = stream.getVideoTracks()[0];
	const setting = track.getSettings();
	const settingWidth = setting.width || 100 ;
	const settingHeight = setting.height || 100;
	const video = document.createElement("video");
	divRoot.appendChild(video);
	video.width = Math.floor(100 * (settingWidth < settingHeight ? 1 : settingWidth / settingHeight));
	video.height = Math.floor(100 * (settingHeight < settingWidth ? 1 : settingHeight / settingWidth));
	video.srcObject = stream;
	video.play();

	// 画像処理キャンバス作成
	const canvasDraw = document.createElement("canvas");
	canvasDraw.width = 256;
	canvasDraw.height = 256;
	const context = canvasDraw.getContext("2d");
	// 表示キャンバス作成
	const canvasView = document.createElement("canvas");
	divRoot.appendChild(canvasView);

	// opencvの読込待機
	await new Promise(resolve => { cv.then(() => resolve()); });
	divMessage.innerHTML = "start";

	// メインループ
	const mainloop = () => {
		// カメラから画像を抽出
		const aspectRatioVideo = video.videoWidth / video.videoHeight;
		const aspectRatioCanvas = canvasDraw.width / canvasDraw.height;
		const srcw = Math.floor(aspectRatioVideo < aspectRatioCanvas ? video.videoWidth : video.videoHeight * canvasDraw.width / canvasDraw.height);
		const srch = Math.floor(aspectRatioVideo > aspectRatioCanvas ? video.videoHeight : video.videoWidth * canvasDraw.height / canvasDraw.width);
		const srcx = Math.floor((video.videoWidth - srcw) / 2);
		const srcy = Math.floor((video.videoHeight - srch) / 2);
		context.drawImage(video, srcx, srcy, srcw, srch, 0, 0, canvasDraw.width, canvasDraw.height);

		const src = cv.imread(canvasDraw);
		const matGray = new cv.Mat();

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

