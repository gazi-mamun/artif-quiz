"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 🎇 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});
const index_js_1 = require("./index.js");
const DB = process.env.DATABASE_LOCAL;
mongoose_1.default.set('strictQuery', false);
mongoose_1.default.connect(DB).then(() => console.log('MongoDB connected.!'));
const port = process.env.PORT || 5000;
const server = index_js_1.app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 🎇 Shutting down...');
    console.log(err?.name, err?.message);
    server.close(() => {
        process.exit(1);
    });
});
//# sourceMappingURL=server.js.map