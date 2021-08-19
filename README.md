## Sensible State Machines

I want an object to run to a platform, and jump on it. Jump has three phases acceleration, hanging in the air, deceleration.

Additionally, in jumping deceleration, object can optionally double jump to grab on to a ledge, which is a different state.

How do I model this interaction in a simple sensible matter.

I used two classes with a state machine for running and jumping states like this:

this.jump = StateMachine([RestState, AccelerationState, HangingState, DecelerationState]);
this.run = StateMachine([RestState, AccelerationState, PacingState]);

so I could do this.jump.transition(1) which increases the player velocity as defined in acceleration state, than transitions into hanging state and so on.
this.jump.transition(0) will put the player to rest state and set the velocity to 0.

Now additionally I have to check if I see a platform ahead to make a jump:

if (!!'check platform ahead') {
    // decide to make a single jump once
}

if (!!'check in jumping decelleration and can grap on a ledge') {
    // decide to make a double jump
}
