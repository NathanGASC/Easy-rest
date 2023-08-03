"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.REST = void 0;
var REST = /** @class */ (function () {
    function REST(prisma, entity, validation, relations, logger, onSQLFail) {
        this.prisma = prisma;
        this.entity = entity;
        this.validation = validation;
        this.relations = relations;
        this.logger = logger;
        this.onSQLFail = onSQLFail || this.onSQLFail;
    }
    REST.prototype.findAll = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var page, entities, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.debug("findAll ".concat(this.entity.toString()));
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        page = undefined;
                        if (req.query.p)
                            page = parseInt(req.query.p);
                        entities = void 0;
                        if (!this.relations) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prisma[this.entity].findMany({ include: this.relations, skip: page ? page * this.config.api.pagination.maxItem : undefined, take: this.config.api.pagination.maxItem })];
                    case 2:
                        entities = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.prisma[this.entity].findMany({ skip: page ? page * this.config.api.pagination.maxItem : undefined, take: this.config.api.pagination.maxItem })];
                    case 4:
                        entities = _b.sent();
                        _b.label = 5;
                    case 5:
                        res.json(entities);
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _b.sent();
                        this.onSQLFail(error_1, req, res);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    REST.prototype.findById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, entity, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("findById ".concat(this.entity.toString()));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        id = req.query.id;
                        if (!id)
                            return [2 /*return*/, res.json({ error: "no id given" })];
                        return [4 /*yield*/, this.prisma[this.entity].findUnique({ where: { id: parseInt(id) }, include: this.relations })];
                    case 2:
                        entity = _a.sent();
                        res.json(entity);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        this.onSQLFail(error_2, req, res);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    REST.prototype.create = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var error, data, entity, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.debug("create ".concat(this.entity.toString()));
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        error = this.validation.validate(req.body).error;
                        if (error) {
                            res.json({ error: error.message });
                            return [2 /*return*/];
                        }
                        data = req.body;
                        return [4 /*yield*/, this.prisma[this.entity].create({ data: data })];
                    case 2:
                        entity = _b.sent();
                        res.json(entity);
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _b.sent();
                        this.onSQLFail(error_3, req, res);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    REST.prototype.update = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var error, id, data, entity, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.debug("".concat(req.id, " : update ").concat(this.entity.toString()));
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        error = this.validation.validate(req.body).error;
                        if (error) {
                            res.json({ error: error.message });
                            return [2 /*return*/];
                        }
                        id = req.query.id;
                        if (!id)
                            return [2 /*return*/, res.json({ error: "no id given" })];
                        data = req.body;
                        return [4 /*yield*/, this.prisma[this.entity].update({ where: { id: parseInt(id) }, data: data })];
                    case 2:
                        entity = _b.sent();
                        res.json(entity);
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _b.sent();
                        this.onSQLFail(error_4, req, res);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    REST.prototype.delete = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var id, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.debug("".concat(req.id, " : delete ").concat(this.entity.toString()));
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        id = req.query.id;
                        if (!id)
                            return [2 /*return*/, res.json({ error: "no id given" })];
                        return [4 /*yield*/, this.prisma[this.entity].delete({ where: { id: parseInt(id) } })];
                    case 2:
                        _b.sent();
                        res.json({ message: "".concat(this.entity.toString(), " deleted") });
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _b.sent();
                        this.onSQLFail(error_5, req, res);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    REST.prototype.onSQLFail = function (error, req, res) {
        this.logger.error(error.toString());
    };
    return REST;
}());
exports.REST = REST;
//# sourceMappingURL=rest.js.map