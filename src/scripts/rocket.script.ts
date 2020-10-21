interface props {
    dir: vmath.vector3,
    speed: number,
    life: number
}
go.property("dir", vmath.vector3());

export function init(this: props): void {
    this.speed = 200;
    this.life = 1;
}

export function update(this: props, dt:number): void {
    let pos = go.get_position();
    pos = pos + this.dir * this.speed * dt as vmath.vector3;
    go.set_position(pos);

    this.life -= dt;
    if (this.life < 0) {
        explode(this);
    }
}

export function on_message(this: props, messageId: hash, message: {other_id: hash}, _sender: url): void {
    if (messageId == hash("animation_done")) {
        go.delete();
    }
    else if (messageId == hash("collision_response")) {
        explode(this);
        go.delete(message.other_id);
        msg.post("/gui#ui", "add_score", {score: 100});
    }
}

function explode(ctx: props) {
    ctx.life = 1000;
    go.set_rotation(vmath.quat());
    ctx.speed = 0;
    msg.post("#sprite", "play_animation", {id: hash("explosion")});
}
