// TODO: create interface for input actions in the input namespace
interface action {
    pressed: boolean
}

interface props {
    moving: boolean,
    firing: boolean,
    input: vmath.vector3,
    dir: vmath.vector3,
    speed: number
}

export function init(this: props): void {
    msg.post(".", "acquire_input_focus");

    this.moving = false;
    this.firing = false;
    this.input = vmath.vector3();
    this.dir = vmath.vector3(0, 1, 0);
    this.speed = 50;
}

export function final(): void {
    msg.post(".", "release_input_focus");
}

export function update(this: props, dt: number): void {
    if (this.moving) {
        let pos = go.get_position();
        pos = pos + this.dir * this.speed * dt as vmath.vector3;
        go.set_position(pos);
    }

    if (this.firing) {
        const angle = math.atan2(this.dir.y, this.dir.x);
        const rot = vmath.quat_rotation_z(angle);
        const props = { dir: this.dir };
        factory.create("#rocketfactory", undefined, rot, props);
    }

    this.input.x = 0;
    this.input.y = 0;
    this.moving = false;
    this.firing = false;
}

export function on_input(this: props, actionId: hash, action: action): void {
    if (actionId === hash("up")) {
        this.input.y = 1;
    }
    else if (actionId === hash("down")) {
        this.input.y = -1;
    }
    else if (actionId === hash("left")) {
        this.input.x = -1;
    }
    else if (actionId === hash("right")) {
        this.input.x = 1;
    }
    else if (actionId === hash("fire") && action.pressed) {
        this.firing = true;
    }

    if (vmath.length(this.input) > 0) {
        this.moving = true;
        this.dir = vmath.normalize(this.input);
    }
}
