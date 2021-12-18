import {
    BufferAttribute,
    BufferGeometry,
    ColorRepresentation,
    DirectionalLight,
    DoubleSide,
    Euler,
    Group,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    PCFSoftShadowMap,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    Vector3,
    WebGLRenderer
} from "three";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { degToRad } from "three/src/math/MathUtils";

import "./default.css";

class Clock {

    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;

    static _scene: Scene;

    hourHand: Hand;
    minuteHand: Hand;
    secondHand: Hand;
    static tmp?: Group;

    private shadows = true;

    constructor() {
        this.scene = new Scene();
        Clock._scene = this.scene;

        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        this.renderer = new WebGLRenderer({ antialias: true, precision: 'highp' });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap
        window.onresize = () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }

        this.hourHand = new HourHand();
        this.minuteHand = new MinuteHand();
        this.secondHand = new SecondHand();

        this.scene.add(this.hourHand.mesh, this.minuteHand.mesh, this.secondHand.mesh)

        this.addBackground();
        this.addLightning();
        this.addHourMarks();
        this.addMinuteMarks();

        const loader = new GLTFLoader();

        loader.load('model/total_out/total.gltf', function (gltf) {
            console.log(gltf)
            gltf.scene.rotateX(Math.PI / 2);
            gltf.scene.castShadow = true;
            const material = new MeshPhongMaterial({
                color: 0xFF6666
            });

            const m = gltf.scene.children[0];

            const g = (m.children[0] as Mesh).geometry


            const mest = new Mesh(g, material);
            Clock.tmp = gltf.scene;
            mest.castShadow = true
            mest.matrixAutoUpdate = false;
            mest.rotateZ(Math.PI)
            mest.updateMatrix();
            gltf.scene.children.forEach(c => c.castShadow = true)
            Clock._scene.add(gltf.scene);
        }, undefined, function (error) {
            console.error(error);
        });

        document.body.appendChild(this.renderer.domElement);

        this.animate = this.animate.bind(this);
        this.animate();
    }

    animate(): void {
        this.hourHand.rotate();
        this.minuteHand.rotate();
        this.secondHand.rotate();

        if (Clock.tmp) {
            const c = Clock.tmp;
            Clock.tmp.matrixAutoUpdate = false;
            let s = Clock.tmp.children[0].getObjectByName('minute')
            if (s) {
                s.set
                s.matrixAutoUpdate = false;
                
                s.updateMatrix()
            }

            Clock.tmp.rotateY(0.01);
            Clock.tmp.updateMatrix();
        }

        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }

    getMeshes(): Mesh[] {
        return [this.hourHand.mesh, this.minuteHand.mesh, this.secondHand.mesh];
    }

    private addBackground() {
        const geometry = new PlaneGeometry(40, 40);
        geometry.translate(0, 0, -10)
        const material = new MeshPhongMaterial({
            color: 0x666666
        });
        const mesh = new Mesh(geometry, material);
        mesh.receiveShadow = true;
        this.scene.add(mesh);
    }

    private addLightning() {
        const light = new DirectionalLight(0xffffff, 1.1);
        light.position.set(2, 2, 4)
        if (this.shadows) {
            light.castShadow = true;
            light.shadow.mapSize.width = 4096;
            light.shadow.mapSize.height = 4096;
            light.shadow.camera.near = 0.5;
            light.shadow.camera.far = 500;
        }
        this.scene.add(light);
    }

    private addHourMarks() {
        this.sweep(12, [0.05, 0.04, 0.1])
    }

    private addMinuteMarks() {
        this.sweep(60, [0.02, 0.01, 0.1]);
    }

    private sweep(n: number, scale: number[]) {
        for (let i = 0; i < n; i++) {
            const mesh = Clock.createMesh(scale, 0x666666);

            mesh.matrixAutoUpdate = false;
            mesh.rotateZ(Math.PI * 2 / n * i);
            mesh.translateY(2);
            mesh.translateZ(-0.1)
            mesh.updateMatrix();

            this.scene.add(mesh)
        }
    }

    public static createMesh(scale: number[], color?: ColorRepresentation) {
        const _color = color ?? 0xffffff;

        const vertices = new Float32Array([
            -1.0, 0.0, 1.0,
            1.0, 0.0, 1.0,
            1.0, -10.0, 1.0,
            -1.0, 0.0, 1.0,
            1.0, -10.0, 1.0,
            -1.0, -10.0, 1.0,
        ]);

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new BufferAttribute(vertices, 3));
        geometry.scale(scale[0], scale[1], scale[2])

        const material = new MeshBasicMaterial({ color: _color })
        material.side = DoubleSide;

        const mesh = new Mesh(geometry, material);

        mesh.matrixAutoUpdate = false;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }

}

abstract class Hand {

    mesh: Mesh;
    originalRotation: Euler;
    originalPosition: Vector3;
    date: Date;
    static readonly defaultColor = 0x333333;

    constructor() {
        const mesh = Clock.createMesh(this.getScale(), this.getColor());
        mesh.rotateZ(Math.PI)
        mesh.translateY(0.2)

        this.mesh = mesh;
        this.originalRotation = mesh.rotation.clone();
        this.originalPosition = mesh.position.clone();
        this.date = new Date();
    }

    abstract getScale(): number[];

    abstract getAngle(): number;

    getColor() {
        return Hand.defaultColor;
    }

    rotate(): void {
        this.date = new Date();
        this.mesh.rotation.copy(this.originalRotation);
        this.mesh.position.copy(this.originalPosition);
        this.mesh.translateY(-0.2);
        this.mesh.rotateZ(-1 * this.getAngle());
        this.mesh.translateY(0.2);
        this.mesh.updateMatrix();
    }

}

class HourHand extends Hand {

    getAngle(): number {
        const minutes = this.date.getHours() % 12 * 60 + this.date.getMinutes();
        return Math.PI * 2 * minutes / (60 * 12);
    }

    getScale(): number[] {
        return [0.1, 0.15, 0.0];
    }

}

class MinuteHand extends Hand {

    getAngle(): number {
        const seconds = this.date.getMinutes() * 60 + this.date.getSeconds();
        return Math.PI * 2 * seconds / 3600;
    }

    getScale(): number[] {
        return [.07, 0.2, 0.0];
    }

}

class SecondHand extends Hand {

    getAngle(): number {
        const milliseconds = this.date.getSeconds() * 1000 + this.date.getMilliseconds();
        return Math.PI * 2 * milliseconds / 60000;
    }
    getScale(): number[] {
        return [0.02, 0.2, 0.0];
    }

    getColor(): number {
        return 0x990000;
    }

}

const clock = new Clock();
