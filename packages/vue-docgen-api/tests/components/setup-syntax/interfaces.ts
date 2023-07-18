interface WithProgress {
	/**
	 * The percentage of the circle that is filled.
	 */
	progress?: string | number
}

interface WithStrokeAndProgress extends WithProgress {
	/**
	 * The percentage of the circle that is filled.
	 */
	progress?: number
	/**
	 * The stroke width of the circle.
	 */
	stroke: number
}

interface WithRadius {
	/**
	 * The radius of the circle.
	 */
	radius: number
}

export interface PropsInterface extends WithStrokeAndProgress, WithRadius {}
