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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismApiREST = void 0;
var joi_1 = __importDefault(require("joi"));
var rest_1 = require("./rest");
var node_color_log_1 = __importDefault(require("node-color-log"));
var PrismApiREST = /** @class */ (function () {
    function PrismApiREST() {
        this.rest = function (config) {
            var _this = this;
            return function (req, res, next) {
                var routes = {};
                for (var key in config.prisma.client) {
                    if (key[0] != "_" && key[0] != "$") {
                        routes[key] = key;
                    }
                }
                Object.keys(routes).forEach(function (model) { return __awaiter(_this, void 0, void 0, function () {
                    var Model, validation, composer, GeneratedREST, generatedRoutes, _a, id;
                    var _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                if (!req.path.includes(model))
                                    return [2 /*return*/];
                                Model = config.prisma.client[model];
                                validation = ((_b = config.api) === null || _b === void 0 ? void 0 : _b.validation) ? (_c = config.api) === null || _c === void 0 ? void 0 : _c.validation[model] : undefined;
                                composer = ((_d = config.api) === null || _d === void 0 ? void 0 : _d.composer) ? (_e = config.api) === null || _e === void 0 ? void 0 : _e.composer[model] : undefined;
                                if (validation === undefined) {
                                    validation = joi_1.default.object();
                                    node_color_log_1.default.warn("No validation for model \"".concat(model, "\". The POST and PUT request will not have validation for this model."));
                                }
                                if (composer === undefined) {
                                    node_color_log_1.default.warn("No composer for model \"".concat(model, "\"."));
                                }
                                GeneratedREST = /** @class */ (function (_super) {
                                    __extends(GeneratedREST, _super);
                                    function GeneratedREST(prisma) {
                                        var _this = _super.call(this, prisma, Model, validation, composer, config.api.logger, config.api.onSQLFail) || this;
                                        _this.entity = model;
                                        _this.config = config;
                                        return _this;
                                    }
                                    return GeneratedREST;
                                }(rest_1.REST));
                                generatedRoutes = new GeneratedREST(config.prisma.client);
                                _a = req.method;
                                switch (_a) {
                                    case "GET": return [3 /*break*/, 1];
                                    case "POST": return [3 /*break*/, 6];
                                    case "PUT": return [3 /*break*/, 8];
                                    case "DELETE": return [3 /*break*/, 10];
                                }
                                return [3 /*break*/, 12];
                            case 1:
                                id = req.query.id;
                                if (!id) return [3 /*break*/, 3];
                                return [4 /*yield*/, generatedRoutes.findById(req, res)];
                            case 2:
                                _f.sent();
                                return [3 /*break*/, 5];
                            case 3: return [4 /*yield*/, generatedRoutes.findAll(req, res)];
                            case 4:
                                _f.sent();
                                _f.label = 5;
                            case 5: return [3 /*break*/, 13];
                            case 6: return [4 /*yield*/, generatedRoutes.create(req, res)];
                            case 7:
                                _f.sent();
                                return [3 /*break*/, 13];
                            case 8: return [4 /*yield*/, generatedRoutes.update(req, res)];
                            case 9:
                                _f.sent();
                                return [3 /*break*/, 13];
                            case 10: return [4 /*yield*/, generatedRoutes.delete(req, res)];
                            case 11:
                                _f.sent();
                                return [3 /*break*/, 13];
                            case 12: return [3 /*break*/, 13];
                            case 13:
                                next();
                                return [2 /*return*/];
                        }
                    });
                }); });
            };
        };
    }
    return PrismApiREST;
}());
exports.PrismApiREST = PrismApiREST;
//# sourceMappingURL=index.js.map