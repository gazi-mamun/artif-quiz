"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const appError_js_1 = __importDefault(require("./utils/appError.js"));
// import globalErrorHandler from './modules/errorModule/error.service.js';
const app = (0, express_1.default)();
exports.app = app;
////////////////
// middlewares
////////////////
app.use((0, cors_1.default)({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'],
    credentials: true,
}));
// Set security HTTP headers
app.use((0, helmet_1.default)());
// body parser, reading data from body into req.body
app.use(express_1.default.json());
// cookie parser, reading cookie from req.body
app.use((0, cookie_parser_1.default)());
// Data sanitization against NoSQL query injection
app.use((0, express_mongo_sanitize_1.default)());
// Serving static files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '/uploads')));
// Development logging
if (process.env.NODE_ENV === `development`) {
    app.use((0, morgan_1.default)(`dev`));
}
// limit requests from same API
const limiter = (0, express_rate_limit_1.default)({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: `Too many requests from this IP, Please try again in an hour!`,
});
app.use(`/api`, limiter);
////////////////////////////
// importing routes
////////////////////////////
// const adsRoute = require('./routes/adsRoutes');
//////////////// x
// routes
////////////////
app.use('/api/v1/', (req, res) => { });
app.all(`*`, (req, res, next) => {
    console.log(req);
    next(new appError_js_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
//# sourceMappingURL=index.js.map