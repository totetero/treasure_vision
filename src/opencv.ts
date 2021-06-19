
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

export declare class Mat {
	delete(): void;
}

declare const cv: {
	COLOR_RGBA2GRAY: number;

	Mat: typeof Mat;

	then: (callback: () => void) => void;
	imread: (canvas: HTMLCanvasElement) => Mat;
	imshow: (canvas: HTMLCanvasElement, mat: Mat) => void;
	cvtColor: (src: Mat, dst: Mat, code: number, dstChannel: number) => void;
};

export default cv;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

