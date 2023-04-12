"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismApiREST = void 0;
var joi = __importStar(require("joi"));
var rest_1 = require("./rest");
var node_color_log_1 = __importDefault(require("node-color-log"));
var PrismApiREST = /** @class */ (function () {
    function PrismApiREST() {
        this.rest = function (config) {
            return function (req, res, next) {
                var routes = {};
                for (var key in config.prisma.client) {
                    if (key[0] != "_" && key[0] != "$") {
                        routes[key] = key;
                    }
                }
                Object.keys(routes).forEach(function (model) {
                    var _a, _b, _c, _d, _e;
                    if (!req.path.includes(model))
                        return;
                    var Model = config.prisma.client[model];
                    var validation = ((_a = config.api) === null || _a === void 0 ? void 0 : _a.validation) ? (_b = config.api) === null || _b === void 0 ? void 0 : _b.validation[model] : undefined;
                    var composer = ((_c = config.api) === null || _c === void 0 ? void 0 : _c.composer) ? (_d = config.api) === null || _d === void 0 ? void 0 : _d.composer[model] : undefined;
                    if (validation === undefined) {
                        validation = joi.object();
                        node_color_log_1.default.warn("No validation for model \"".concat(model, "\". The POST and PUT request will not have validation for this model."));
                    }
                    if (composer === undefined) {
                        node_color_log_1.default.warn("No composer for model \"".concat(model, "\"."));
                    }
                    var GeneratedREST = /** @class */ (function (_super) {
                        __extends(GeneratedREST, _super);
                        function GeneratedREST(prisma) {
                            var _this = _super.call(this, prisma, Model, validation, composer) || this;
                            _this.entity = model;
                            return _this;
                        }
                        return GeneratedREST;
                    }(rest_1.REST));
                    var generatedRoutes = new GeneratedREST(config.prisma.client);
                    switch (req.method) {
                        case "GET":
                            var id = (_e = req.url.match(/[0-9]*\/?$/)) === null || _e === void 0 ? void 0 : _e[0];
                            if (id) {
                                generatedRoutes.findById(req, res);
                            }
                            else {
                                generatedRoutes.findAll(req, res);
                            }
                            break;
                        case "POST":
                            generatedRoutes.create(req, res);
                            break;
                        case "PUT":
                            generatedRoutes.update(req, res);
                            break;
                        case "DELETE":
                            generatedRoutes.delete(req, res);
                            break;
                        default:
                            break;
                    }
                });
            };
        };
    }
    return PrismApiREST;
}());
exports.PrismApiREST = PrismApiREST;
//# sourceMappingURL=index.js.map