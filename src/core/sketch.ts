import p5 from "p5";

let sketch: p5;

export function init(_sketch: p5 | undefined) {
	if (_sketch) {
		sketch = _sketch;
	} else {
		if (!("p5" in globalThis)) {
			throw Error("Can't find p5.js, it is required for Brass");
		}
		if (!("setup" in globalThis)) {
			throw Error("Can't seem to find p5; If you are running in instance mode pass the sketch into Brass.init()");
		}
		sketch = globalThis as unknown as p5;
	}

	// sketch.disableFriendlyErrors = true;
}

export function getSketch() {
	return sketch;
}