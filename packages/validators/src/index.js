"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unused = void 0;
var zod_1 = require("zod");
exports.unused = zod_1.z.string().describe("This lib is currently not used as we use drizzle-zod for simple schemas\n   But as your application grows and you need other validators to share\n   with back and frontend, you can put them in here\n  ");
