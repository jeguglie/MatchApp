var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from "react";
import FileUpload from "./lib/FileUpload";
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            file: null
        };
        return _this;
    }
    App.prototype.onFileChange = function (event) {
        console.log(event);
        this.setState({
            file: event.target.files[0]
        });
    };
    App.prototype.render = function () {
        return (React.createElement("div", { className: "App" },
            React.createElement("header", { className: "App-header" },
                React.createElement("h1", { className: "App-title" }, "Welcome to React")),
            React.createElement("p", { className: "App-intro" }),
            React.createElement(FileUpload, { fieldName: "testFile", file: this.state.file, onChange: this.onFileChange.bind(this) }),
            React.createElement(FileUpload, { fieldName: "testFile", file: this.state.file, onChange: this.onFileChange.bind(this) })));
    };
    return App;
}(React.Component));
export default App;
//# sourceMappingURL=App.js.map