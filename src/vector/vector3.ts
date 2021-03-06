import { Vector2 } from "./vector2";
import { VectorAbstract } from "./vectorAbstract";



export type Vertex3 = { x: number; y: number; z: number; };



export class Vector3 extends VectorAbstract {
	static fromObj(obj: Vertex3) {
		if (typeof obj.x !== "number" || typeof obj.y !== "number" || typeof obj.z !== "number") {
			throw Error("Object can't be transformed into Vector3 without numeric x, y and z properties");
		}

		return new Vector3(obj.x, obj.y, obj.z);
	}

	static fromObjFast(obj: Vertex3) {
		return new Vector3(obj.x, obj.y, obj.z);
	}

	x: number;
	y: number;
	z: number;

	constructor(x = 0, y = x, z = y) {
		super();
		this.x = x;
		this.y = y;
		this.z = z;
	}

	copy() {
		return new Vector3(this.x, this.y, this.z);
	}

	equal(vec: Vertex3) {
		return this.x === vec.x && this.y === vec.y && this.z === vec.z;
	}

	equalScalar(x: number, y = x, z = y) {
		return this.x === x && this.y === y && this.z === z;
	}

	set(vec: Vertex3) {
		this.x = vec.x;
		this.y = vec.y;
		this.z = vec.z;
		return this;
	}

	setScalar(x = 0, y = x, z = y) {
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}

	add(vec: Vertex3) {
		this.x += vec.x;
		this.y += vec.y;
		this.z += vec.z;
		return this;
	}

	addScalar(x = 0, y = x, z = y) {
		this.x += x;
		this.y += y;
		this.z += z;
		return this;
	}

	sub(vec: Vertex3) {
		this.x -= vec.x;
		this.y -= vec.y;
		this.z -= vec.z;
		return this;
	}

	subScalar(x = 0, y = x, z = y) {
		this.x -= x;
		this.y -= y;
		this.z -= z;
		return this;
	}

	mult(vec: Vertex3) {
		this.x *= vec.x;
		this.y *= vec.y;
		this.z *= vec.z;
		return this;
	}

	multScalar(x = 1, y = x, z = y) {
		this.x *= x;
		this.y *= y;
		this.z *= z;
		return this;
	}

	div(vec: Vertex3) {
		this.x /= vec.x;
		this.y /= vec.y;
		this.z /= vec.z;
		return this;
	}

	divScalar(x = 1, y = x, z = y) {
		this.x /= x;
		this.y /= y;
		this.z /= z;
		return this;
	}


	rem(vec: Vertex3) {
		this.x %= vec.x;
		this.y %= vec.y;
		this.z %= vec.z;
		return this;
	}

	remScalar(x = 1, y = x, z = y) {
		this.x %= x;
		this.y %= y;
		this.z %= z;
		return this;
	}

	mod(vec: Vertex3) {
		this.x = ((this.x % vec.x) + vec.x) % vec.x;
		this.y = ((this.y % vec.y) + vec.y) % vec.y;
		this.z = ((this.z % vec.z) + vec.z) % vec.z;
		return this;
	}

	modScalar(x = 1, y = x, z = y) {
		this.x = ((this.x % x) + x) % x;
		this.y = ((this.y % y) + y) % y;
		this.z = ((this.z % z) + z) % z;
		return this;
	}

	abs() {
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);
		this.z = Math.abs(this.z);
		return this;
	}

	floor() {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);
		return this;
	}

	round() {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		this.z = Math.round(this.z);
		return this;
	}

	ceil() {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		this.z = Math.ceil(this.z);
		return this;
	}

	mix(vec: Vertex3, amount: number) {
		this.x = this.x + (vec.x - this.x) * amount;
		this.y = this.y + (vec.y - this.y) * amount;
		this.z = this.z + (vec.y - this.z) * amount;
		return this;
	}

	norm(magnitude = 1) {
		const mag = this.mag;
		if (mag === 0)
			return this;

		const multiplier = magnitude / mag;

		this.x *= multiplier;
		this.y *= multiplier;
		this.z *= multiplier;
		return this;
	}

	limit(limit = 1) {
		if (this.mag > limit)
			this.norm(limit);
		return this;
	}

	min(vec: Vector3) {
		this.x = Math.min(this.x, vec.x);
		this.y = Math.min(this.y, vec.y);
		this.z = Math.min(this.z, vec.z);
		return this;
	}

	minScalar(x: number, y = x, z = y) {
		this.x = Math.min(this.x, x);
		this.y = Math.min(this.y, y);
		this.z = Math.min(this.z, z);
		return this;
	}

	max(vec: Vector3) {
		this.x = Math.max(this.x, vec.x);
		this.y = Math.max(this.y, vec.y);
		this.z = Math.max(this.z, vec.z);
		return this;
	}

	maxScalar(x: number, y = x, z = y) {
		this.x = Math.max(this.x, x);
		this.y = Math.max(this.y, y);
		this.z = Math.max(this.z, z);
		return this;
	}

	dot(vec: Vertex3) {
		return this.x * vec.x + this.y * vec.y + this.z * vec.z;
	}

	cross(vec: Vertex3) {
		this.x = this.y * vec.z - this.z * vec.y;
		this.y = this.z * vec.x - this.x * vec.z;
		this.z = this.x * vec.y - this.y * vec.x;

		return this;
	}

	dist(vec: Vertex3) {
		const resultX = this.x - vec.x, resultY = this.y - vec.y, resultZ = this.z - vec.z;
		return Math.sqrt(resultX * resultX + resultY * resultY + resultZ * resultZ);
	}

	distSq(vec: Vertex3) {
		const resultX = this.x - vec.x, resultY = this.y - vec.y, resultZ = this.z - vec.z;
		return resultX * resultX + resultY * resultY + resultZ * resultZ;
	}

	get xy() {
		return new Vector2(this.x, this.y);
	}

	set xy(vec: Vector2) {
		[this.x, this.y] = vec.array;
	}

	get xz() {
		return new Vector2(this.x, this.z);
	}

	set xz(vec: Vector2) {
		[this.y, this.z] = vec.array;
	}

	get yx() {
		return new Vector2(this.y, this.x);
	}

	set yx(vec: Vector2) {
		[this.y, this.x] = vec.array;
	}

	get yz() {
		return new Vector2(this.y, this.z);
	}

	set yz(vec: Vector2) {
		[this.y, this.z] = vec.array;
	}

	get zy() {
		return new Vector2(this.z, this.y);
	}
	
	set zy(vec: Vector2) {
		[this.z, this.y] = vec.array;
	}

	get zx() {
		return new Vector2(this.z, this.x);
	}
	
	set zx(vec: Vector2) {
		[this.z, this.x] = vec.array;
	}

	get xyz() {
		return new Vector3(this.x, this.y, this.z);
	}
	
	set xyz(vec: Vector3) {
		[this.x, this.y, this.z] = vec.array;
	}

	get xzy() {
		return new Vector3(this.x, this.z, this.y);
	}
	
	set xzy(vec: Vector3) {
		[this.x, this.z, this.y] = vec.array;
	}

	get yxz() {
		return new Vector3(this.y, this.x, this.z);
	}
	
	set yxz(vec: Vector3) {
		[this.y, this.x, this.z] = vec.array;
	}

	get yzx() {
		return new Vector3(this.y, this.z, this.x);
	}
	
	set yzx(vec: Vector3) {
		[this.y, this.z, this.x] = vec.array;
	}

	get zyx() {
		return new Vector3(this.z, this.y, this.x);
	}
	
	set zyx(vec: Vector3) {
		[this.z, this.y, this.x] = vec.array;
	}

	get zxy() {
		return new Vector3(this.z, this.x, this.y);
	}

	set zxy(vec: Vector3) {
		[this.z, this.x, this.y] = vec.array;
	}

	get mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	set mag(magnitude) {
		this.norm(magnitude);
	}

	get magSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	get array(): [number, number, number] {
		return [this.x, this.y, this.z];
	}

	set array([x, y, z]: [number, number, number]) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}