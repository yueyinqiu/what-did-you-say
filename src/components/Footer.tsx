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
                    到底啦！
                </p>
            </div>
        );
    }
}
