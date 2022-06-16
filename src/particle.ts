import { getP5DrawTarget, P5DrawTargetMap } from "./drawSurface";
import { TilemapAbstract } from "./tilemap";
import { getTime } from "./time";
import { Vector2, Vertex2 } from "./vector3";
import { getDefaultViewpoint } from "./viewpoint";



type ParticleClass = new (position: Vector2, ...rest: any[]) => ParticleAbstract;



const particles = new Map<symbol, ParticleAbstract>();
let particleLimit = 300;



export function update(delta: number) {
	for (const [particleId, particle] of particles) {
		particle.update(delta);

		if (particle.alive()) continue;

		particle.kill();
		particles.delete(particleId);
	}

	if (particles.size > particleLimit) {
		removeParticles(particles.size - particleLimit);
	}
}

export function draw(v = getDefaultViewpoint(), d = getP5DrawTarget("defaultP5")) {
	const g = d.getMaps().canvas;
	const viewArea = v.getViewArea(d);

	for (const [_, particle] of particles.entries()) {
		const visibleX = particle.position.x + particle.radius > viewArea.minX &&
			particle.position.x - particle.radius < viewArea.maxX;
		const visibleY = particle.position.y + particle.radius > viewArea.minY &&
			particle.position.y - particle.radius < viewArea.maxY;

		if (visibleX && visibleY) {
			g.push();

			g.translate(particle.position.x, particle.position.y);
			g.scale(particle.radius);

			particle.draw(g);

			g.pop();
		}
	}
}

// removes old particles when too many are in the scene
function removeParticles(amount: number) {
	// particles stored as [key, value] in array and sorted
	const sortedParticles = [...particles.entries()]
		.sort((a, b) => a[1].radius - b[1].radius);

	amount = Math.min(amount, Math.floor(sortedParticles.length / 5));

	for (let i = 0; i < amount * 5; i += 5) {
		sortedParticles[i][1].kill();
		particles.delete(sortedParticles[i][0]);
	}
}

export function setParticleLimit(limit: number) {
	particleLimit = limit;
}

export function emit(classVar: ParticleClass, amount: number, position: Vertex2, ...data: any[]) {
	// percent of limit filled
	const limitFilled = particles.size / particleLimit;
	// spawn less when near/over limit
	amount *= Math.max(0.1, 1 - Math.pow(limitFilled * 0.9, 6));

	while (amount > 1 || amount > Math.random()) {
		emitParticle(classVar, position, data);

		amount--;
	}
}

export function emitSingle(classVar: ParticleClass, position: Vertex2, ...data: any[]) {
	// percent of limit filled
	const limitFilled = particles.size / particleLimit;
	// don't spawn less when over limit
	if (limitFilled > 1 &&
		limitFilled > 1 + Math.random()) return;

	emitParticle(classVar, position, data);
}

function emitParticle(classVar: ParticleClass, position: Vertex2, data: any[]) {
	const particle = new classVar(Vector2.fromObjFast(position), ...data);

	particles.set(Symbol(), particle);
}



// named abstract because update() *should* be replaced
// class may be extended in JS where abstract class may not be honored
export class ParticleAbstract {

	position: Vector2;
	radius = 1;
	lifetime = 5000;
	private spawnTime: number;

	constructor(position: Vertex2) {
		this.position = Vector2.fromObj(position);
		this.spawnTime = getTime();
	}

	update(delta: number) { }

	draw(g: P5DrawTargetMap) {
		g.noStroke();
		g.fill(255, 0, 255);
		g.circle(0, 0, 2);
	}

	alive() {
		return this.age < 1;
	}

	// what to do when particle dies, nothing by default
	kill() { }

	get age() {
		return (getTime() - this.spawnTime) / this.lifetime;
	}
}



// named abstract because update() *should* be replaced
export class VelocityParticleAbstract extends ParticleAbstract {
	protected velocity: Vector2;

	constructor(position: Vector2, velocity = new Vector2()) {
		super(position);
		this.velocity = velocity;
	}

	protected updateKinomatics(delta: number) {
		this.position.add(this.velocity.copy().multScalar(delta));
	}

	// simple collision without matter.js
	protected collide(tilemap: TilemapAbstract) {
		const { x, y } = this.position.copy().divScalar(tilemap.tileSize);
		const radius = this.radius / tilemap.tileSize;
		let deltaX = 0, deltaY = 0;

		if (tilemap.getSolid(Math.floor(x - radius), Math.floor(y)) &&
			!tilemap.getSolid(Math.floor(x - radius) + 1, Math.floor(y))) {
			deltaX = Math.ceil(x - radius) + radius - x;
		}

		if (tilemap.getSolid(Math.floor(x + radius), Math.floor(y)) &&
			!tilemap.getSolid(Math.floor(x + radius) - 1, Math.floor(y))) {

			const newDeltaX = Math.floor(x + radius) - radius - x;
			if (deltaX === 0 || Math.abs(newDeltaX) < Math.abs(deltaX)) deltaX = newDeltaX;
		}

		if (tilemap.getSolid(Math.floor(x), Math.floor(y - radius)) &&
			!tilemap.getSolid(Math.floor(x), Math.floor(y - radius) + 1)) {
			deltaY = Math.ceil(y - radius) + radius - y;
		}

		if (tilemap.getSolid(Math.floor(x), Math.floor(y + radius)) &&
			!tilemap.getSolid(Math.floor(x), Math.floor(y + radius) - 1)) {

			const newDeltaY = Math.floor(y + radius) - radius - y;
			if (deltaY === 0 || Math.abs(newDeltaY) < Math.abs(deltaY)) deltaY = newDeltaY;
		}

		if (deltaX !== 0 && deltaY !== 0) {
			if (Math.abs(deltaX) < Math.abs(deltaY)) {
				this.position.x += deltaX * tilemap.tileSize;
				this.velocity.x = 0;
			} else {
				this.position.y += deltaY * tilemap.tileSize;
				this.velocity.y = 0;
			}
		} else if (deltaX !== 0) {
			this.position.x += deltaX * tilemap.tileSize;
			this.velocity.x = 0;
		} else if (deltaY !== 0) {
			this.position.y += deltaY * tilemap.tileSize;
			this.velocity.y = 0;
		}
	}
}