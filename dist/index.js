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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismApiREST = void 0;
var client_1 = require("@prisma/client");
var express_1 = __importDefault(require("express"));
var joi_1 = __importDefault(require("joi"));
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
                    var _a, _b, _c, _d;
                    if (!req.path.includes(model))
                        return;
                    var Model = config.prisma.client[model];
                    var validation = ((_a = config.api) === null || _a === void 0 ? void 0 : _a.validation) ? (_b = config.api) === null || _b === void 0 ? void 0 : _b.validation[model] : undefined;
                    var composer = ((_c = config.api) === null || _c === void 0 ? void 0 : _c.composer) ? (_d = config.api) === null || _d === void 0 ? void 0 : _d.composer[model] : undefined;
                    if (validation === undefined) {
                        validation = joi_1.default.object();
                        node_color_log_1.default.warn("No validation for model \"".concat(model, "\". The POST and PUT request will not have validation for this model."));
                    }
                    if (composer === undefined) {
                        node_color_log_1.default.warn("No composer for model \"".concat(model, "\"."));
                    }
                    var GeneratedREST = /** @class */ (function (_super) {
                        __extends(GeneratedREST, _super);
                        function GeneratedREST(prisma) {
                            var _this = _super.call(this, prisma, Model, validation, composer, config.api.logger) || this;
                            _this.entity = model;
                            _this.config = config;
                            return _this;
                        }
                        return GeneratedREST;
                    }(rest_1.REST));
                    var generatedRoutes = new GeneratedREST(config.prisma.client);
                    switch (req.method) {
                        case "GET":
                            var id = req.query.id;
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
var prisma = new client_1.PrismaClient();
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(new PrismApiREST().rest({
    //We give the prisma client to the config
    "prisma": {
        "client": prisma
    },
    //We configure the api
    "api": {
        //By seting the composer we set dependencies between models. It's the "include" of prisma. You can find more about it at https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries.
        "composer": {
            //We set that the user model will have a posts field and should contain the Post model. If we don't put this, the user model will not have the posts field
            "user": {
                "posts": true
            },
            //We set that the post model will have a author field and should contain the User model. We also say that the author field should contain the posts field.
            "post": {
                "author": {
                    "include": {
                        "posts": true
                    }
                }
            }
        },
        //We validate the data which are sent in the body of the request.
        "validation": {
            //For example here, an user should have a name & email. Try to do a post request on user without it and you will receive guidance to correct
            "user": joi_1.default.object({
                "name": joi_1.default.string().required(),
                "email": joi_1.default.string().email().required()
            })
        },
        //We set the pagination. Here we set that the max number of item per page is 10. If you ask for the first page with ?p=1 in your request, you will have 10 items max
        "pagination": {
            "maxItem": 10
        },
        //We set a logger. It's a way to enable/disable/customize logs. It's optional, if not defined, no logs will be displayed
        "logger": {
            log: function () {
                var msg = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    msg[_i] = arguments[_i];
                }
                return console.log("LOG: ".concat(msg.join(" ")));
            },
            warn: function () {
                var msg = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    msg[_i] = arguments[_i];
                }
                return console.log("WARN: ".concat(msg.join(" ")));
            },
            error: function () {
                var msg = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    msg[_i] = arguments[_i];
                }
                return console.log("ERROR: ".concat(msg.join(" ")));
            },
            debug: function () {
                var msg = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    msg[_i] = arguments[_i];
                }
                return console.log("DEBUG: ".concat(msg.join(" ")));
            },
            info: function () {
                var msg = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    msg[_i] = arguments[_i];
                }
                return console.log("INFO: ".concat(msg.join(" ")));
            }
        }
    }
}));
var port = 3000;
app.listen(port, function () {
    console.log("Server listen on port ".concat(3000));
});
//# sourceMappingURL=index.js.map