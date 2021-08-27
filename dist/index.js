
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
	const canvasView1 = document.createElement("canvas");
	const canvasView2 = document.createElement("canvas");
	divRoot.appendChild(canvasView1);
	divRoot.appendChild(canvasView2);

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

		const matSrc = cv.imread(canvasDraw);
		const matHsv = new cv.Mat();
		const matLowerb = new cv.Mat(canvasDraw.height, canvasDraw.width, cv.CV_8UC3, new cv.Scalar(62, 100, 0));
		const matUpperb = new cv.Mat(canvasDraw.height, canvasDraw.width, cv.CV_8UC3, new cv.Scalar(79, 255, 255));
		const matAaa = new cv.Mat();
		const matBbb = new cv.Mat();
		const matHierarchy = new cv.Mat();
		const vecContours = new cv.MatVector();

		// 何かの変換
		cv.cvtColor(matSrc, matHsv, cv.COLOR_BGR2HSV, 0);
		cv.inRange(matHsv, matLowerb, matUpperb, matAaa);
		cv.findContours(matAaa, vecContours, matHierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
		for (let i = 0; i < vecContours.size(); i++) {
			const matContour = vecContours.get(i);
			const area = cv.contourArea(matContour, false);
			if (area < 10) { continue; }
			cv.drawContours(matSrc, vecContours, i, [255, 0, 0, 255], 4);
		}

		// 描画
		cv.imshow(canvasView1, matSrc);
		cv.imshow(canvasView2, matAaa);

		matSrc.delete();
		matHsv.delete();
		matLowerb.delete();
		matUpperb.delete();
		matAaa.delete();
		matBbb.delete();
		matHierarchy.delete();
		vecContours.delete();

		window.requestAnimationFrame(mainloop);
	};

	// メインループ開始
	window.requestAnimationFrame(mainloop);
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

