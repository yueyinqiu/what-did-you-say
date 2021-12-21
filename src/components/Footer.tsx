import * as React from "react";
import './Footer.css';

export default class Footer extends React.Component<{}> {
    constructor(unit: {}) {
        super(unit);
    }

    render() {
        return (
            <div className="footer">
                <p>
                    在GITHUB开源：<a href="https://github.com/yueyinqiu/what-did-you-say.git" target="_blank">https://github.com/yueyinqiu/what-did-you-say.git</a>
                </p>
            </div>
        );
    }
}
