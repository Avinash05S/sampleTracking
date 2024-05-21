import { ClassicPreset } from 'rete';


const socket = new ClassicPreset.Socket('socket')

class Node extends ClassicPreset.Node {
    constructor(name: string) {
        super(name);
        this.label = name
        const input = new ClassicPreset.Input(socket);
        const output = new ClassicPreset.Output(socket);
        this.addInput(input.id, input);
        this.addOutput(output.id||"hi", output);
        this.addControl("C", new ClassicPreset.InputControl("text", { initial: 3, change: (val: number) => console.log(val) }));
        console.log(this.controls, this.inputs);
    }

    data() {
        console.log(this.controls);
        return {
            value: 9
        }
    }

}

export default Node;