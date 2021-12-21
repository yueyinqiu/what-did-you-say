import assert from "assert";
import * as React from "react";
import Algorithm from "../tools/Algorithm";
import Base64 from "../tools/Base64";
import './Main.css';

interface MainState {
    plaintext: string;
    ciphertext: string;
}

export default class Main extends React.Component<{}, MainState> {
    algorithm = new Algorithm();
    utf8Enc = new TextEncoder();
    utf8Dec = new TextDecoder();
    base64 = new Base64();

    constructor() {
        super({});
        this.state = { plaintext: "", ciphertext: "" };
    }

    cipherRef = React.createRef<HTMLTextAreaElement>();
    plainRef = React.createRef<HTMLTextAreaElement>();

    render() {
        return (
            <div className="Main">
                <h1>你说的是啥？</h1>
                <div>
                    <textarea placeholder="你想让人看不懂的内容" wrap="virtual" ref={this.plainRef} value={this.state.plaintext} onInput={this.keepInput.bind(this)}></textarea>
                </div>
                <div>
                    <button onClick={this.enc.bind(this)}>变复杂吧！</button>
                    <button onClick={this.dec.bind(this)}>变简单吧！</button>
                </div>
                <div>
                    <textarea placeholder="你想要去看懂它的内容" wrap="virtual" ref={this.cipherRef} value={this.state.ciphertext} onInput={this.keepInput.bind(this)}></textarea>
                </div>
            </div>
        );
    }

    keepInput() {
        let plaintext = this.plainRef.current?.value;
        assert(plaintext !== undefined);
        let base64Value = this.cipherRef.current?.value;
        assert(base64Value !== undefined);
        this.setState({ plaintext: plaintext, ciphertext: base64Value });
    }

    enc() {
        let plaintext = this.plainRef.current?.value;
        assert(plaintext !== undefined);

        let utf8Value = this.utf8Enc.encode(plaintext);
        let ciphertext = this.algorithm.encrypt(utf8Value);
        let base64Value = this.base64.base64EncArr(ciphertext).replaceAll("=", "");
        this.setState({ plaintext: plaintext, ciphertext: base64Value });// "（" + base64Value + "）" });
    }
    dec() {
        let base64Value = this.cipherRef.current?.value;
        assert(base64Value !== undefined);
        /*
        if (base64Value.startsWith("（")) {
            if (base64Value.endsWith("）"))
                base64Value = base64Value.substring(1, base64Value.length - 1);
            else
                base64Value = base64Value.substring(1);
        }
        else if (base64Value.endsWith("）"))
            base64Value = base64Value.substring(0, base64Value.length - 1);
        */

        let ciphertext = this.base64.base64DecToArr(base64Value);
        let utf8Value = this.algorithm.decrypt(ciphertext);
        let plaintext = utf8Value === null ? base64Value + "？我也看不懂呀！" : this.utf8Dec.decode(utf8Value);
        this.setState({ plaintext: plaintext, ciphertext: base64Value }); //"（" + base64Value + "）" });
    }
}