"use strict";
/**
 * To run this test, you should first follow the README.md to create the database with Prisma.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var index_1 = require("./index");
var client_1 = require("@prisma/client");
var joi_1 = __importDefault(require("joi"));
var prisma = new client_1.PrismaClient();
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(new index_1.PrismApiREST().rest({
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
        },
        "onSQLFail": function (error, req, res) {
            //Here we customize the error message when a SQL error happen. It's a good idea to not display SQL error to the user in release for security reason.
            res.json({
                error: error.toString()
            });
        }
    }
}));
var port = 3000;
app.listen(port, function () {
    console.log("Server listen on port ".concat(port));
});
//# sourceMappingURL=test.js.map